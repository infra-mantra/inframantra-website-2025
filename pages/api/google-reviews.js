// Server-side Google Places reviews fetch for the home-page reviews wall.
// Configure with env vars:
//   GOOGLE_PLACES_API_KEY  (a server key with the Places API enabled AND billing
//                           enabled on its Google Cloud project)
//   GOOGLE_PLACE_ID        (Inframantra's Google Place ID)
// Falls back to NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for the key, and will try to
// resolve the Place ID by name if GOOGLE_PLACE_ID isn't set.
// On any failure it returns an empty list (the wall still shows current reviews)
// and — importantly — does NOT cache failures, so it retries on the next request.

let cache = { at: 0, data: null };
const TTL = 1000 * 60 * 60 * 6; // 6 hours — only successful responses are cached

const empty = (source) => ({ reviews: [], rating: null, total: null, source });

async function getJson(url, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const r = await fetch(url, { signal: controller.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (cache.data && now - cache.at < TTL) {
      return res.status(200).json(cache.data);
    }

    const key = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!key) return res.status(200).json(empty("unconfigured"));

    let placeId = process.env.GOOGLE_PLACE_ID;

    // Resolve the Place ID from a text search when not provided.
    if (!placeId) {
      const findUrl =
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
        `?input=${encodeURIComponent("Inframantra Gurugram")}` +
        `&inputtype=textquery&fields=place_id&key=${key}`;
      const fj = await getJson(findUrl);
      if (fj?.status !== "OK") {
        console.error("[google-reviews] findplace:", fj?.status, fj?.error_message || "");
        return res.status(200).json(empty(`find-${fj?.status || "unknown"}`));
      }
      placeId = fj?.candidates?.[0]?.place_id;
    }

    if (!placeId) return res.status(200).json(empty("no-place"));

    const detUrl =
      "https://maps.googleapis.com/maps/api/place/details/json" +
      `?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${key}`;
    const dj = await getJson(detUrl);

    if (dj?.status !== "OK") {
      // Quota/key/billing errors come back as HTTP 200 with a status field.
      // Do NOT cache these — retry on the next request.
      console.error("[google-reviews] details:", dj?.status, dj?.error_message || "");
      return res.status(200).json(empty(`api-${dj?.status || "unknown"}`));
    }

    // The home-page wall is a curated testimonials showcase, so it displays
    // only strongly-positive reviews (4★+). NOTE: the headline `rating` and
    // `total` below are left as Google's real, un-curated numbers so the
    // aggregate stays truthful — we curate which review CARDS are featured,
    // we do not misrepresent the overall score.
    const MIN_RATING = 4;

    const result = dj.result || {};
    const reviews = (result.reviews || [])
      .filter((r) => r && r.text && r.text.trim().length > 0)
      .filter((r) => Math.round(r.rating || 5) >= MIN_RATING)
      .map((r, i) => ({
        id: `g-${r.time || i}`,
        name: r.author_name || "Google User",
        role: "Google Review",
        text: r.text.trim(),
        rating: Math.round(r.rating || 5),
        avatar: r.profile_photo_url || "",
        source: "google",
        time: r.relative_time_description || "",
      }));

    const payload = {
      reviews,
      rating: result.rating || null,
      total: result.user_ratings_total || null,
      source: reviews.length ? "google" : "google-empty",
    };

    // Only cache a genuinely successful response.
    cache = { at: now, data: payload };
    return res.status(200).json(payload);
  } catch (e) {
    console.error("[google-reviews]", e?.message || e);
    return res.status(200).json(empty("error"));
  }
}
