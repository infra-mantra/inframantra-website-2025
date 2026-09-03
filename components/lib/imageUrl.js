/**
 * Route a remote image through Next's built-in optimizer.
 *
 * Several card images on the CDN are full-size originals — one premium-property
 * JPEG is 627 KB and a WebP 458 KB — being rendered into a 282x150 card. Asking
 * the optimizer for the size actually needed takes that 458 KB down to ~19 KB.
 *
 * This only rewrites the `src`; the markup, dimensions and classes are untouched,
 * so layout and styling are unchanged.
 *
 * Only hosts allowlisted in next.config.js `images.domains` may be optimized —
 * anything else (relative paths, data: URLs, other hosts) is returned as-is so it
 * still renders normally rather than 400ing from /_next/image.
 *
 * NOTE: widths must be one of next.config.js `imageSizes`/`deviceSizes`, and AVIF
 * sources pass through unchanged (the squoosh fallback cannot decode AVIF) — they
 * are already small, so that is fine.
 */
const OPTIMIZABLE_HOST =
  /^https?:\/\/(inframantra\.blr1\.(cdn\.)?digitaloceanspaces\.com|cms\.inframantra\.com|images\.unsplash\.com|i\.ytimg\.com)\//;

export const optimizedSrc = (url, width = 384, quality = 75) =>
  url && OPTIMIZABLE_HOST.test(url)
    ? `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
    : url;

export default optimizedSrc;
