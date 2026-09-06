# Image pipeline

How images are served on this site, and what to do when you add new ones.

## TL;DR

```bash
# Add new images to public/assets/images/, then:
npm run images

# If you have the high-res originals somewhere, point at them — quality is
# noticeably better when derivatives come from the master rather than a
# previously compressed .webp:
ORIGINALS_DIR=../soule npm run images
```

Then use `<ResponsiveImage>` instead of `<img>` and give it a `sizes` prop.
Nothing else is required — the paths in `src/data/content.js` stay as they are.

---

## What was wrong

The site was slow and janky for three reasons, only one of which was file size.

**1. Decode cost, not download size.** A `4000×4000` image occupies
`4000 × 4000 × 4 = 61 MB` of RAM once decoded, no matter whether the file on
disk is 200 KB or 2 MB. Across the 153 images in the project that came to
**3.04 GB** of decoded bitmap. Compressing harder does nothing to this number;
only resizing does.

The worst offenders were the logos: twelve `8000×4500` files, ~100 KB each on
disk (so they looked harmless) but **137 MB decoded each** — and one of them was
the favicon, and two more were in the navbar on every single page.

**2. One size for every device.** There was no `srcset` anywhere in the
codebase, so a phone on a 390px screen downloaded and decoded the same 4000px
render as a 5K desktop.

**3. No intrinsic dimensions.** No `<img>` carried `width`/`height`, so the
browser could not reserve space before the bytes arrived. That is the layout
shift that made scrolling feel broken.

Separately, `ImageSpotlight` called `getBoundingClientRect()` for every image on
every `mousemove` — 50+ forced layout flushes per event — which dropped frames
on its own, before any image had decoded.

## What it does now

`scripts/optimize-images.mjs` walks `public/assets/images/` and, for each image,
writes AVIF **and** WebP at up to five widths into `public/assets/opt/`:

```
public/assets/opt/projects/01_summer-house/14/400.avif
public/assets/opt/projects/01_summer-house/14/400.webp
public/assets/opt/projects/01_summer-house/14/800.avif
...
```

Photos get `[400, 800, 1200, 1600, 2400]`; logos get `[200, 400, 800]` and never
more, which is what fixed the 8000px problem.

It also writes two manifests:

| File | Contents | Used by |
| --- | --- | --- |
| `public/assets/image-manifest.json` | full record incl. blur placeholders | tooling / debugging |
| `src/data/image-manifest.json` | dimensions, widths, dominant colour (29 KB) | bundled into the app |

The bundled one is keyed by the **original** path — the same string already
written in `content.js` — so `<ResponsiveImage src="/assets/images/...">` finds
everything it needs synchronously, with no extra network round-trip and no edits
to the content files.

### Quality

The earlier conversion lost quality because it compressed hard *and* kept full
resolution — the worst of both. This does the opposite:

- **AVIF quality 58.** AVIF's scale is not JPEG's; 58 is visually excellent.
- **WebP quality 85**, `smartSubsample` on. Indistinguishable from source for
  photographic content once correctly downscaled.
- **Logos** encode at AVIF 72 / WebP 92 with `4:4:4` chroma and full alpha
  quality, because hard edges and text fall apart under subsampling.
- Downscaling uses Lanczos3, and never upscales.

Where a matching original exists in `ORIGINALS_DIR`, derivatives are encoded
from **that** rather than from the already-lossy `.webp`, avoiding generation
loss entirely. **72 of the 153 images** currently qualify.

Measured against the untouched original as reference (PSNR at 1600px, higher is
closer to the real photo), across a sample of those 72:

```
  OLD (previous .webp, browser-downscaled)  27.7 dB
  NEW (tier we now serve)                   38.4 dB    +10.7 dB
```

For the 81 images with no original, the existing `.webp` *is* the reference and
re-encoding costs a little — they measure **37.4 dB** against it, which is
visually indistinguishable at the sizes actually displayed. Those images get
the speed benefit but not a quality upgrade.

### How originals are matched

Matching on filename alone is unsafe here: several projects contain a `1.webp`
or a `14.webp`. The script therefore verifies every candidate before using it —
the original must be at least as large, within 2% of the same aspect ratio, and
match a 16×16 grayscale fingerprint of the image it claims to be the source of.
Candidates that fail fall back to the existing `.webp`.

*(This guard caught 8 false matches on the first run, including one that would
have replaced a square `4000×4000` living-room render with an unrelated 16:9
image.)*

### Cache invalidation

Each output directory carries a `.source.json` stamp recording exactly which
file the derivatives were encoded from. A re-run rebuilds whenever that source
changes — a new original appears, or the matcher's verdict changes.

This matters: "the output file already exists" is *not* a safe cache key. When
the fingerprint check above was added, it correctly began rejecting originals it
had previously accepted — but the derivatives from those bad matches were
already on disk, and a file-exists check happily kept them. Ten images were
serving the wrong picture until an audit caught it. The stamp closes that hole.

`scripts/missing-originals.txt` lists every image still lacking a verified
original. Drop those masters into `ORIGINALS_DIR` under the same base filename
and re-run with `npm run images:force` to upgrade them.

## Using `<ResponsiveImage>`

```jsx
import ResponsiveImage from '../components/common/ResponsiveImage';

<ResponsiveImage
  src="/assets/images/projects/01_summer-house/1.webp"
  alt="Summer House"
  sizes="(max-width: 768px) 100vw, 33vw"
  priority={false}
/>
```

| Prop | Purpose |
| --- | --- |
| `sizes` | **The one that matters.** The rendered CSS width of the slot. Get it wrong and the browser picks the wrong tier — either wasted bytes or a blurry image. |
| `priority` | `true` for above-the-fold / LCP images. Sets `loading="eager"` + `fetchpriority="high"`. Everything else stays lazy. |
| `maxWidth` | Cap the largest tier offered, e.g. `400` for a small logo. |

It renders a `<picture>` with AVIF and WebP sources plus intrinsic
`width`/`height` and a dominant-colour placeholder. `<picture>` is
`display: contents`, so the `<img>` behaves as a direct child of whatever
container it was dropped into — existing CSS keeps working untouched.

**If a path is missing from the manifest it degrades to a plain lazy `<img>`
pointing at the original file.** Nothing breaks; it just misses the
optimisation. So adding an image and forgetting to run `npm run images` is safe.

For places a real `<img>` is impossible — CSS `background-image`, `og:image` —
use the helper:

```js
import { optimizedUrl } from '../utils/imageManifest';
optimizedUrl(IMAGES.bedroom4, 1600); // -> '/assets/opt/DAY%20BEDROOM%20VIEW%204/1600.webp'
```

## Results

Summer House project page, 16 images, desktop @1x:

| | Before | After | |
| --- | --- | --- | --- |
| Payload | 6.2 MB | 0.95 MB | −85% |
| Decoded RAM | 228 MB | 35 MB | −85% |
| Mobile @1x payload | 6.2 MB | 0.31 MB | −95% |

Across all 153 images, decoded RAM drops from **3.04 GB to 0.33 GB (−89%)**.
The navbar logo alone went from 137 MB decoded to 1.4 MB.

## Deployment note

`public/assets/opt/` is 1256 derivative files / ~177 MB (198M on disk) and is committed,
so Vercel deploys stay fast
and no image work happens at build time. These files are immutable and only
change when you add images.

If you would rather keep that out of git, add `public/assets/opt` to
`.gitignore` and change the build script to:

```json
"build": "node scripts/optimize-images.mjs && vite build"
```

Derivatives are then generated on each deploy from the committed
`public/assets/images/` masters. That costs a few minutes of build time and
loses the quality upgrade from `ORIGINALS_DIR` (those masters are not in the
repo), so committing is the better default unless repo size becomes a problem.

Both `/assets/images/*` and `/assets/opt/*` are served with
`Cache-Control: immutable, max-age=31536000` via `vercel.json`.
