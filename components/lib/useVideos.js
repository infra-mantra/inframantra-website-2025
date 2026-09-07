import useSWR from "swr";

/*
  Home-page videos, from the CMS.

  These two rails used to be hard-coded lists (shorts/shortsData.js and
  reviews/reviewVideosData.js). Those files are still imported and passed in as
  `fallback`, and they are what renders when the API has not answered yet, fails,
  or returns nothing — the home page must never show an empty video rail because
  a backend is down, and the fallback also means the first paint has content
  rather than a gap that fills in later.

  The API stores one collection for both rails; `section` tells them apart. The
  gallery's "Awards & Recognition" strip is not a third section — it is
  section "shorts" filtered to category "awards", the same as before.
*/

const fetcher = (url) => fetch(url).then((r) => r.json());

// Controller responses are wrapped by ApiResponse: { statusCode, data, message }.
const unwrap = (payload) => (Array.isArray(payload?.data) ? payload.data : null);

/* CMS shape -> the shape ShortCard already expects. */
const toShort = (v) => ({
  platform: v.platform || "youtube",
  id: v.videoId,
  url: v.url,
  thumb: v.thumb,
  title: v.title,
  category: v.category,
  // "" is meaningful here (an ordinary vertical Short), so only set it when set.
  ...(v.frame ? { frame: v.frame } : {}),
});

/* CMS shape -> the shape ReviewVideos' VideoCard already expects. */
const toReviewVideo = (v) => ({
  id: v.videoId,
  label: v.title,
  caption: v.subtitle || "",
});

/**
 * @param {"shorts"|"testimonial"} section
 * @param {Array} fallback  the bundled list, used until/unless the API answers
 */
export function useVideos(section, fallback = []) {
  const { data } = useSWR(
    process.env.apiUrl1 ? `${process.env.apiUrl1}/video/get?section=${section}&isActive=true` : null,
    fetcher,
    {
      // A video rail does not change minute to minute, and this sits on the home
      // page — re-fetching on every focus would be pure cost.
      revalidateOnFocus: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
  );

  const rows = unwrap(data);
  if (!rows || rows.length === 0) return fallback;

  const mapped = rows.map(section === "testimonial" ? toReviewVideo : toShort);
  // A row with no video id would render a card with a broken thumbnail.
  return mapped.filter((v) => v.id || v.url);
}

export default useVideos;
