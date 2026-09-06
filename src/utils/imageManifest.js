import manifest from '../data/image-manifest.json';

/**
 * Lookup helpers for the build-time image manifest produced by
 * scripts/optimize-images.mjs.
 *
 * Kept out of ResponsiveImage.jsx so that file only exports a component
 * (a react-refresh requirement) and so non-component code — CSS backgrounds,
 * meta tags, preloads — can resolve optimised URLs too.
 */

/**
 * Resolve a manifest entry from a path as written in content.js / constants.js.
 *
 * Those files mix plain and percent-encoded paths ("KITCHEN 1.webp" vs
 * "KITCHEN%201.webp") while the manifest is keyed by the real filename, so we
 * try the string as given and both normalisations before giving up.
 */
export function lookup(src) {
  if (!src) return null;
  if (manifest[src]) return manifest[src];
  try {
    const decoded = decodeURI(src);
    if (manifest[decoded]) return manifest[decoded];
  } catch {
    /* malformed escape sequence — fall through */
  }
  try {
    const encoded = encodeURI(src);
    if (manifest[encoded]) return manifest[encoded];
  } catch {
    /* ignore */
  }
  return null;
}

/** Build a `srcset` string for one format across the given widths. */
export function srcSetFor(entry, ext, widths) {
  return widths.map((w) => `${encodeURI(`${entry.base}/${w}.${ext}`)} ${w}w`).join(', ');
}

/**
 * Resolve a single optimised URL, for the places a real <img> is not possible:
 * CSS `background-image`, canvas, og:image, manual <link rel="preload">.
 * Returns the input unchanged when the image is not in the manifest.
 *
 *   optimizedUrl(IMAGES.bedroom4, 1600)
 *     -> '/assets/opt/DAY%20BEDROOM%20VIEW%204/1600.webp'
 */
export function optimizedUrl(src, targetWidth = 1200, ext = 'webp') {
  const entry = lookup(src);
  if (!entry) return src;
  const w = entry.widths.find((x) => x >= targetWidth) ?? entry.widths[entry.widths.length - 1];
  return encodeURI(`${entry.base}/${w}.${ext}`);
}

export default manifest;
