#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Builds responsive derivatives for every image under public/assets/images.
 *
 *   For each source image it emits:
 *     public/assets/opt/<same/relative/path>/<width>.avif
 *     public/assets/opt/<same/relative/path>/<width>.webp
 *
 *   ...plus public/assets/image-manifest.json mapping the ORIGINAL src path
 *   (the one already used in src/data/content.js) to its available widths,
 *   intrinsic dimensions and a tiny inline blur placeholder.
 *
 * Because the manifest is keyed by the existing path, content.js needs no
 * edits at all — <ResponsiveImage src="/assets/images/..."> resolves the rest.
 *
 * Source selection:
 *   If ORIGINALS_DIR is set and contains a file whose basename matches the
 *   target, that high-resolution original is used as the encode source.
 *   Otherwise the existing .webp is used. Re-encoding from the original is
 *   always preferred: generation loss compounds.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   ORIGINALS_DIR=../soule node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --force      # ignore cache, rebuild all
 *   node scripts/optimize-images.mjs --report     # analyse only, write nothing
 */

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.PROJECT_ROOT
  ? path.resolve(process.env.PROJECT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public/assets/images');
const OUT_DIR = path.join(ROOT, 'public/assets/opt');
const MANIFEST = path.join(ROOT, 'public/assets/image-manifest.json');
// A second, slimmer copy lives in src/ so Vite bundles it. Importing it
// synchronously means no extra round-trip before the first image can be sized,
// which is what actually prevents layout shift.
const MANIFEST_SRC = path.join(ROOT, 'src/data/image-manifest.json');
const MISSING_REPORT = path.join(ROOT, 'scripts/missing-originals.txt');

const ORIGINALS_DIR = process.env.ORIGINALS_DIR
  ? path.resolve(ROOT, process.env.ORIGINALS_DIR)
  : null;

const FORCE = process.argv.includes('--force');
const REPORT_ONLY = process.argv.includes('--report');
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

const RASTER = /\.(webp|jpe?g|png|tiff?|avif)$/i;

/* ------------------------------------------------------------------ *
 * Encoding profiles
 *
 * These quality numbers are the whole ballgame. AVIF's scale is not
 * JPEG's — 58 is visually excellent, not "58% good". WebP 85 with a
 * proper Lanczos downscale is indistinguishable from source for photos.
 * The previous single-pass conversion lost quality because it encoded
 * low AND kept full resolution; we do the opposite of both.
 * ------------------------------------------------------------------ */
const PROFILES = {
  photo: {
    widths: [400, 800, 1200, 1600, 2400],
    avif: { quality: 58, effort: 4, chromaSubsampling: '4:2:0' },
    webp: { quality: 85, effort: 5, smartSubsample: true },
  },
  // Logos and vector-ish artwork: hard edges wreck at low quality and
  // chroma subsampling, and they are never displayed large.
  logo: {
    widths: [200, 400, 800],
    avif: { quality: 72, effort: 6, chromaSubsampling: '4:4:4' },
    webp: { quality: 92, effort: 6, alphaQuality: 100, smartSubsample: false },
  },
};

function classify(relPath) {
  const p = relPath.toLowerCase();
  if (p.startsWith('png/') || /logo|vector/.test(path.basename(p))) return 'logo';
  return 'photo';
}

/* ------------------------------------------------------------------ */

async function walk(dir, base = dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) out.push(...(await walk(full, base)));
    else if (RASTER.test(e.name)) out.push(path.relative(base, full));
  }
  return out;
}

/** Normalise a filename for fuzzy matching against the originals folder. */
function matchKey(file) {
  return path
    .basename(file)
    .replace(/\.(webp|jpe?g|png|tiff?|avif)$/i, '')
    .replace(/\.jpg$/i, '') // several files are named "foo.jpg.jpeg"
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function indexOriginals() {
  if (!ORIGINALS_DIR) return new Map();
  const files = await walk(ORIGINALS_DIR);
  const map = new Map();
  for (const rel of files) {
    const full = path.join(ORIGINALS_DIR, rel);
    const key = matchKey(rel);
    const { size } = await fs.stat(full);
    // Keep every candidate: filenames like "14" collide across projects, so
    // the name alone cannot decide. verifyMatch() picks the real one.
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ full, size });
  }
  for (const list of map.values()) list.sort((a, b) => b.size - a.size);
  return map;
}

/**
 * A 16x16 grayscale fingerprint. Filename matching alone is unsafe here —
 * many projects contain a "1.webp" or "14.webp" — so every candidate original
 * is compared against the image it claims to be the source of. If they are not
 * visually the same picture we fall back to the existing .webp rather than
 * silently swapping in a different render.
 */
const HASH_N = 16;
async function fingerprint(file) {
  const buf = await sharp(file, { limitInputPixels: 512 * 1024 * 1024 })
    .resize(HASH_N, HASH_N, { fit: 'fill', kernel: 'cubic' })
    .removeAlpha()
    .grayscale()
    .raw()
    .toBuffer();
  return buf;
}

function meanAbsDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

const MAX_ASPECT_DRIFT = 0.02; // 2%
const MAX_PIXEL_DIFF = 14; // out of 255

async function verifyMatch(candidates, targetPath, targetMeta) {
  if (!candidates || candidates.length === 0) return null;
  const targetAspect = targetMeta.width / targetMeta.height;
  let targetHash = null;

  for (const cand of candidates) {
    let meta;
    try {
      meta = await sharp(cand.full).metadata();
    } catch {
      continue;
    }
    if (!meta.width || !meta.height) continue;

    // The original must be at least as large as the derivative it produced.
    if (meta.width < targetMeta.width * 0.98) continue;

    const aspect = meta.width / meta.height;
    if (Math.abs(aspect - targetAspect) / targetAspect > MAX_ASPECT_DRIFT) continue;

    try {
      targetHash ??= await fingerprint(targetPath);
      const candHash = await fingerprint(cand.full);
      if (meanAbsDiff(targetHash, candHash) <= MAX_PIXEL_DIFF) return cand;
    } catch {
      /* unreadable candidate */
    }
  }
  return null;
}

async function pool(items, limit, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

/** 20px-wide WebP encoded as a data URI, for the blur-up placeholder. */
async function makeLqip(pipeline) {
  const buf = await pipeline
    .clone()
    .resize({ width: 20, withoutEnlargement: true })
    .webp({ quality: 45, alphaQuality: 60 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processOne(rel, originals) {
  const srcPath = path.join(SRC_DIR, rel);
  const currentMeta = await sharp(srcPath).metadata();
  const original = await verifyMatch(originals.get(matchKey(rel)), srcPath, currentMeta);
  const encodeFrom = original ? original.full : srcPath;

  const profile = PROFILES[classify(rel)];
  const meta = await sharp(encodeFrom).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  if (!srcW || !srcH) throw new Error(`no dimensions: ${rel}`);

  const maxTier = Math.max(...profile.widths);
  // Only emit tiers we can produce without upscaling, and never exceed the
  // profile cap. This is the step that kills the 3 GB decode cost: an 8000px
  // logo becomes 800px, a 4000px render becomes 2400px.
  let widths = profile.widths.filter((w) => w <= srcW);
  if (widths.length === 0) widths = [Math.min(srcW, maxTier)];
  else if (srcW < maxTier && !widths.includes(srcW)) widths.push(srcW);
  widths = [...new Set(widths)].sort((a, b) => a - b);

  const outBase = path.join(OUT_DIR, rel.replace(RASTER, ''));
  const relKey = '/assets/images/' + rel.split(path.sep).join('/');

  const entry = {
    w: Math.min(srcW, maxTier),
    h: Math.round((Math.min(srcW, maxTier) / srcW) * srcH),
    aspect: +(srcW / srcH).toFixed(4),
    widths,
    base: '/assets/opt/' + rel.replace(RASTER, '').split(path.sep).join('/'),
    from: original ? 'original' : 'webp',
    c: '#e8e4de',
    lqip: '',
  };

  if (REPORT_ONLY) return { relKey, entry, bytes: 0, skipped: true };

  await fs.mkdir(outBase, { recursive: true });

  /*
   * Cache validity.
   *
   * "The file exists" is NOT sufficient. If the chosen source changes — a new
   * original is dropped in, or (as happened during development) the matcher is
   * corrected and now rejects an original it previously accepted — the existing
   * derivatives were produced from the wrong image and must be discarded. A
   * file-exists check would silently keep serving them forever.
   *
   * So we record the exact source alongside the output and rebuild whenever it
   * differs.
   */
  const stampPath = path.join(outBase, '.source.json');
  const srcStat = await fs.stat(encodeFrom);
  const stamp = {
    from: path.relative(ROOT, encodeFrom),
    size: srcStat.size,
    mtime: Math.round(srcStat.mtimeMs),
    widths,
    profile: classify(rel),
  };
  let stale = FORCE;
  if (!stale) {
    try {
      const prev = JSON.parse(await fs.readFile(stampPath, 'utf8'));
      stale =
        prev.from !== stamp.from ||
        prev.size !== stamp.size ||
        prev.profile !== stamp.profile ||
        String(prev.widths) !== String(stamp.widths);
    } catch {
      stale = true; // no stamp: derivatives predate this check, so redo them
    }
  }
  if (stale) {
    await fs.rm(outBase, { recursive: true, force: true });
    await fs.mkdir(outBase, { recursive: true });
  }
  const base = sharp(encodeFrom, { limitInputPixels: 512 * 1024 * 1024 }).rotate();
  entry.lqip = await makeLqip(base);
  try {
    const { dominant } = await base.clone().stats();
    const hex = (n) => n.toString(16).padStart(2, '0');
    entry.c = `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;
  } catch {
    /* keep the neutral default */
  }

  let bytes = 0;
  for (const w of widths) {
    const resized = base
      .clone()
      .resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' });

    for (const fmt of ['avif', 'webp']) {
      const dest = path.join(outBase, `${w}.${fmt}`);
      if (!FORCE) {
        try {
          const st = await fs.stat(dest);
          bytes += st.size;
          continue;
        } catch {
          /* not built yet */
        }
      }
      // Write to a temp file and rename, so an interrupted run never leaves a
      // truncated derivative that the incremental cache would treat as done.
      const tmp = `${dest}.tmp`;
      const info = await resized.clone()[fmt](profile[fmt]).toFile(tmp);
      await fs.rename(tmp, dest);
      bytes += info.size;
    }
  }

  // Written last, so an interrupted run leaves no stamp and is redone.
  await fs.writeFile(stampPath, JSON.stringify(stamp));

  return { relKey, entry, bytes, skipped: false };
}

/* ------------------------------------------------------------------ */

async function main() {
  const t0 = Date.now();
  const files = await walk(SRC_DIR);
  if (files.length === 0) {
    console.error(`No images found under ${SRC_DIR}`);
    process.exit(1);
  }

  const originals = await indexOriginals();
  console.log(`Source images   : ${files.length}`);
  console.log(
    `Originals index : ${originals.size}${ORIGINALS_DIR ? ` (from ${ORIGINALS_DIR})` : ' (ORIGINALS_DIR not set)'}`
  );
  console.log(`Mode            : ${REPORT_ONLY ? 'report only' : FORCE ? 'rebuild all' : 'incremental'}\n`);

  const manifest = {};
  const missing = [];
  let done = 0;
  let outBytes = 0;
  let decodedBefore = 0;
  let decodedAfter = 0;
  const failures = [];

  await pool(files, CONCURRENCY, async (rel) => {
    try {
      const { relKey, entry, bytes } = await processOne(rel, originals);
      manifest[relKey] = entry;
      outBytes += bytes;

      const srcMeta = await sharp(path.join(SRC_DIR, rel)).metadata();
      decodedBefore += (srcMeta.width || 0) * (srcMeta.height || 0) * 4;
      // Typical desktop card slot resolves to the 800px tier.
      const typical = entry.widths.includes(800) ? 800 : entry.widths[0];
      decodedAfter += typical * Math.round(typical / entry.aspect) * 4;

      if (entry.from === 'webp' && classify(rel) === 'photo') missing.push(relKey);
    } catch (err) {
      failures.push(`${rel}: ${err.message}`);
    }
    done++;
    if (done % 20 === 0 || done === files.length) {
      process.stdout.write(`  processed ${done}/${files.length}\r`);
    }
  });

  console.log('\n');

  if (!REPORT_ONLY) {
    await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 0));

    // The bundled copy drops `lqip` (37 KB of already-compressed base64 that
    // gzip cannot shrink) and `from` (build diagnostics). The dominant colour
    // in `c` gives the same perceived-load benefit for a few bytes.
    const slim = {};
    for (const [k, v] of Object.entries(manifest)) {
      slim[k] = { w: v.w, h: v.h, widths: v.widths, base: v.base, c: v.c };
    }
    await fs.mkdir(path.dirname(MANIFEST_SRC), { recursive: true });
    await fs.writeFile(MANIFEST_SRC, JSON.stringify(slim, null, 0));

    const kb = (p) => (Buffer.byteLength(JSON.stringify(p)) / 1024).toFixed(1);
    console.log(
      `Manifest written : ${Object.keys(manifest).length} entries ` +
        `(public ${kb(manifest)} KB, bundled ${kb(slim)} KB)`
    );
  }

  if (missing.length) {
    const body = [
      '# Images with no matching original found.',
      '# These were re-encoded from the existing .webp, so the largest tier',
      '# inherits its quality. Drop the true originals into ORIGINALS_DIR',
      '# using the SAME base filename, then re-run with --force.',
      '',
      ...missing.sort(),
      '',
    ].join('\n');
    if (!REPORT_ONLY) await fs.writeFile(MISSING_REPORT, body);
    console.log(`Missing originals: ${missing.length} -> ${path.relative(ROOT, MISSING_REPORT)}`);
  }

  const GB = 1073741824;
  const MB = 1048576;
  console.log(`
Decoded RAM (all images, full size)  : ${(decodedBefore / GB).toFixed(2)} GB
Decoded RAM (typical served tier)    : ${(decodedAfter / GB).toFixed(2)} GB
Reduction                            : ${(100 - (decodedAfter / decodedBefore) * 100).toFixed(1)}%
Derivatives on disk                  : ${(outBytes / MB).toFixed(1)} MB
Elapsed                              : ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  if (failures.length) {
    console.log(`\n${failures.length} failed:`);
    failures.slice(0, 20).forEach((f) => console.log('  ' + f));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
