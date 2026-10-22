// Turns a list of video links (YouTube watch / youtu.be / Shorts, Instagram
// reels or posts) into plain objects the media section can render.
// Kept free of React so it is easy to unit-test and reuse.

// aspect: "16:9" for landscape players, "9:16" for vertical (Shorts / Reels).
const PATTERNS = [
  {
    type: "youtube-short",
    aspect: "9:16",
    regex: /youtube\.com\/shorts\/([\w-]{11})/i,
  },
  {
    type: "youtube",
    aspect: "16:9",
    regex: /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i,
  },
  {
    type: "instagram",
    aspect: "9:16",
    regex: /instagram\.com\/(?:[\w.]+\/)?(?:reel|reels|p|tv)\/([\w-]+)/i,
  },
];

/** Classify one URL. Returns null for anything we don't know how to embed. */
export function classifyVideoUrl(url) {
  const clean = String(url || "").trim();
  if (!clean) return null;
  for (const { type, aspect, regex } of PATTERNS) {
    const match = clean.match(regex);
    if (match) return { type, id: match[1], aspect, url: clean };
  }
  return null;
}

/** Classify a list of URLs, dropping blanks, unknown links and duplicates. */
export function classifyVideoUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const url of urls || []) {
    const item = classifyVideoUrl(url);
    const key = item && `${item.type}:${item.id}`;
    if (!item || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

// The CMS today only has `videoUrl` (an array that already mixes watch links
// and Shorts). The other names are read too, so a future `shorts` / `reels`
// field shows up without touching the component.
const VIDEO_FIELDS = ["videoUrl", "shorts", "youtubeShorts", "reels", "instagramReels"];

export function getPropertyVideos(propertyData) {
  const urls = VIDEO_FIELDS.flatMap((field) => {
    const value = propertyData?.[field];
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });
  return classifyVideoUrls(urls);
}

/** Poster image for the click-to-play facade (Instagram has no public one). */
export function getVideoThumbnail(item) {
  if (item.type === "instagram") return null;
  // hqdefault exists for every YouTube video, including Shorts.
  return `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
}

/** iframe src, only requested after the user clicks play. */
export function getEmbedUrl(item) {
  if (item.type === "instagram") return `https://www.instagram.com/reel/${item.id}/embed/`;
  return `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`;
}

export const VIDEO_LABELS = {
  youtube: "Video",
  "youtube-short": "Short",
  instagram: "Reel",
};
