/**
 * Team profile/journey images come straight from the CMS, and one of the two
 * directors' images point at `infra-mantra-new.s3...amazonaws.com`, a bucket that
 * no longer exists — every one of those URLs 404s. The page therefore rendered
 * broken image icons rather than its <NoImage/> placeholder, because a dead URL
 * still looks like a valid one to the component.
 *
 * Verified at the time of writing:
 *   shiwang-suraj  6/6 images  200  (inframantra.blr1.cdn.digitaloceanspaces.com)
 *   garvit-tiwari  0/6 images  404  (infra-mantra-new.s3.ap-south-1.amazonaws.com)
 *
 * The originals are unrecoverable: the bucket is gone and the Wayback Machine has
 * no snapshot of those objects. A solo portrait of the same director does exist on
 * the live CDN, so the profile photo is substituted with it; the per-year journey
 * images have no equivalent and resolve to null, which the timeline already
 * renders as <NoImage/>.
 *
 * THE REAL FIX IS IN THE CMS — re-upload the images against those team entries and
 * this module stops doing anything, because the URLs will no longer match a dead
 * host. Nothing here needs to change when that happens.
 */

// Hosts known to be retired. Anything served from these is treated as missing.
const DEAD_IMAGE_HOST = /^https?:\/\/infra-mantra-new\.s3(\.[a-z0-9-]+)?\.amazonaws\.com\//i;

// Portrait replacements, by team-member slug, for images we can vouch for.
const PROFILE_FALLBACK = {
  "garvit-tiwari":
    "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutUsPage/garvitSolo.avif",
};

/** True when a URL points at storage we know is gone. */
export const isDeadImage = (url) => typeof url === "string" && DEAD_IMAGE_HOST.test(url);

/**
 * Resolve a CMS image URL to something that will actually load.
 * Returns `fallback` (default null) when the URL is dead and we have no stand-in.
 */
export const resolveTeamImage = (url, fallback = null) =>
  !url || isDeadImage(url) ? fallback : url;

/** Profile photo for a member, substituting a known-good portrait where we have one. */
export const resolveProfileImage = (url, slug) =>
  resolveTeamImage(url, PROFILE_FALLBACK[slug] || null);

export default resolveTeamImage;
