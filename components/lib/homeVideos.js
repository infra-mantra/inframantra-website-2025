/*
  Home-page videos, from the CMS — fetched once per page build.

  This replaces the client-side useVideos hook. That hook fetched on mount, so
  the rail first rendered the bundled list and then swapped in the CMS list when
  the request returned; if the two differed, cards reshuffled under the visitor.
  Fetching here bakes the CMS list into the page: no client request, no swap, and
  the section still works when the API is down.

  It runs inside getStaticProps, so it is cached by the page's own revalidate
  (30 minutes, matching every other piece of home-page data). A CMS edit shows up
  on the next regeneration after that window, not instantly — that is the trade
  the rest of this page already makes.

  The API keeps one collection for both rails; `section` tells them apart. The
  gallery's "Awards & Recognition" strip is not a third section — it is section
  "shorts" filtered to category "awards", the same as before.
*/

// Controller responses are wrapped by ApiResponse: { statusCode, data, message }.
const unwrap = (payload) => (Array.isArray(payload?.data) ? payload.data : null);

/*
  These props are serialised into __NEXT_DATA__, and Next rejects `undefined`
  anywhere in them ("undefined cannot be serialized as JSON"). Every YouTube row
  has no `url` or `thumb`, so keys are only written when they carry a value —
  the client hook could pass undefined through; this cannot.
*/
const withValue = (key, value) => (value ? { [key]: value } : {});

/* CMS shape -> the shape ShortCard already expects. */
const toShort = (v) => ({
  platform: v.platform || "youtube",
  id: v.videoId,
  title: v.title,
  category: v.category,
  ...withValue("url", v.url),
  ...withValue("thumb", v.thumb),
  // "" is meaningful here (an ordinary vertical Short), so only set it when set.
  ...withValue("frame", v.frame),
});

/* CMS shape -> the shape ReviewVideos' VideoCard already expects. */
const toReviewVideo = (v) => ({
  id: v.videoId,
  label: v.title,
  caption: v.subtitle || "",
});

// A row with no video id would render a card with a broken thumbnail.
const playable = (v) => Boolean(v.id || v.url);

/*
  A page regeneration waits on this. The /home call it runs beside has no
  timeout, but a hung video API must not be able to hold the whole home page
  hostage, so this one gives up after a few seconds and lets the bundled lists
  render instead.
*/
const TIMEOUT_MS = 5000;

/**
 * @returns {{ shorts: Array|null, testimonials: Array|null }}
 *   Each list is null when the API failed or returned nothing for that section,
 *   so the caller can fall back per rail rather than all-or-nothing.
 */
export async function fetchHomeVideos() {
  const empty = { shorts: null, testimonials: null };
  if (!process.env.apiUrl1) return empty;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // One request for both rails; split here rather than calling twice.
    const res = await fetch(`${process.env.apiUrl1}/video/get?isActive=true`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rows = unwrap(await res.json());
    if (!rows) return empty;

    const shorts = rows.filter((v) => v.section === "shorts").map(toShort).filter(playable);
    const testimonials = rows
      .filter((v) => v.section === "testimonial")
      .map(toReviewVideo)
      .filter(playable);

    return {
      shorts: shorts.length ? shorts : null,
      testimonials: testimonials.length ? testimonials : null,
    };
  } catch (err) {
    // Never fail the build over a video rail. The bundled lists render instead.
    console.warn(`[homeVideos] falling back to bundled lists: ${err.message}`);
    return empty;
  } finally {
    clearTimeout(timer);
  }
}
