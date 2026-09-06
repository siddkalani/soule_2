import { useMemo, useState } from 'react';
import { lookup, srcSetFor } from '../../utils/imageManifest';
import './ResponsiveImage.css';

/**
 * ResponsiveImage
 *
 * Drop-in replacement for <img>. Takes the same `src` paths already used in
 * src/data/content.js and src/utils/constants.js, looks them up in the
 * build-time manifest, and emits a <picture> with AVIF + WebP srcsets, correct
 * intrinsic dimensions and a dominant-colour placeholder.
 *
 * If a path has no manifest entry (a new image added before the optimiser has
 * been re-run) it degrades to a plain lazy <img> pointing at the original file,
 * so nothing ever breaks — it just misses the optimisation.
 *
 * Props
 *   src        required. e.g. '/assets/images/projects/01_summer-house/1.webp'
 *   sizes      CSS `sizes` descriptor. Getting this right is what saves the
 *              bytes: it tells the browser the *rendered* width so it can pick
 *              the smallest sufficient tier. Defaults to '100vw' (worst case).
 *   priority   true for above-the-fold / LCP images. Switches off lazy loading
 *              and sets fetchpriority="high".
 *   maxWidth   cap the largest tier offered (e.g. 800 for a thumbnail grid).
 *
 * Everything else is forwarded to the underlying <img>.
 */

// The `picture` element is display:contents so it never appears in layout —
// existing CSS that targets `.some-wrapper img` keeps working untouched.
const FORMATS = ['avif', 'webp'];

const ResponsiveImage = ({
  src,
  alt = '',
  sizes = '100vw',
  priority = false,
  maxWidth,
  className = '',
  style,
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const entry = useMemo(() => lookup(src), [src]);

  const widths = useMemo(() => {
    if (!entry) return [];
    const list = maxWidth ? entry.widths.filter((w) => w <= maxWidth) : entry.widths;
    return list.length ? list : [entry.widths[0]];
  }, [entry, maxWidth]);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const loadingProps = priority
    ? { loading: 'eager', fetchPriority: 'high', decoding: 'async' }
    : { loading: 'lazy', decoding: 'async' };

  // No manifest entry: serve the original, still lazily.
  if (!entry) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onLoad={handleLoad}
        {...loadingProps}
        {...rest}
      />
    );
  }

  const fallbackWidth = widths[widths.length - 1];
  const fallbackSrc = encodeURI(`${entry.base}/${fallbackWidth}.webp`);

  // The placeholder colour sits behind the image and is cleared once it paints.
  // Keeping it on the <img> itself rather than a wrapper div means no extra DOM
  // node and no risk of disturbing the existing flex/grid layouts.
  const placeholder = loaded
    ? undefined
    : { backgroundColor: entry.c, backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <picture className="rimg">
      {FORMATS.map((ext) => (
        <source key={ext} type={`image/${ext}`} srcSet={srcSetFor(entry, ext, widths)} sizes={sizes} />
      ))}
      <img
        src={fallbackSrc}
        alt={alt}
        width={entry.w}
        height={entry.h}
        className={`rimg-img ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
        style={{ ...placeholder, ...style }}
        onLoad={handleLoad}
        {...loadingProps}
        {...rest}
      />
    </picture>
  );
};

export default ResponsiveImage;
