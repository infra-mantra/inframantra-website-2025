/**
 * Supplementary content for a director profile page (/team/[teamId]).
 *
 * The team endpoint returns an empty BlogList, so the "Articles" section had
 * nothing to render. Real coverage does exist — it just lives in the blog/news/
 * press-release collections — so this module pulls those and keeps only the items
 * that genuinely name the director, either as the writer or in the body.
 *
 * Nothing here fabricates an association: an article is attached to a person only
 * because their name appears in that article's own record.
 */

// The CMS spells the co-founder's name inconsistently across records
// ("Garvit" in the team entry, "Gravit" in some writer_name values, "Garwit" in
// one blog title), so each director needs a set of accepted spellings.
const NAME_PATTERNS = {
  "shiwang-suraj": /shiwang/i,
  "garvit-tiwari": /garvit|gravit|garwit/i,
};

// Awards are three images on the CDN with no titles, years or captions anywhere
// in the CMS — so they are presented as imagery only. Do not add invented labels.
export const AWARD_IMAGES = [
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a1.jpg",
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a2.jpg",
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a3.jpg",
];

const COLLECTIONS = [
  { blogType: "PressRelease", kind: "press", base: "/pr/" },
  { blogType: "news", kind: "news", base: "/news/" },
  { blogType: "blogs", kind: "blog", base: "/blog/" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Format at BUILD time with a fixed format. Never use toLocaleDateString for this:
 * it varies with the machine's locale/timezone, so the SSG output and the client's
 * hydration render can disagree and React throws a mismatch.
 */
const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const safeJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // a flaky collection must not fail the whole page build
  }
};

/**
 * Articles that actually name this director, newest collections first.
 * `writer_name` distinguishes a piece they authored from press coverage about them.
 */
export async function fetchDirectorArticles(apiUrl, slug, limit = 6) {
  const pattern = NAME_PATTERNS[slug];
  if (!pattern || !apiUrl) return [];

  // Dedupe on both slug and normalised title: the same News18 interview is
  // published under two different slugs, and would otherwise appear twice.
  const seenLink = new Set();
  const seenTitle = new Set();
  const out = [];

  for (const { blogType, kind, base } of COLLECTIONS) {
    const json = await safeJson(`${apiUrl}/blog/pageDetail?blogType=${blogType}&limit=100`);
    const items = [
      ...(json?.result?.latestBlogList || []),
      ...(json?.result?.featureBlogList || []),
    ];

    for (const item of items) {
      if (!pattern.test(JSON.stringify(item))) continue;

      const link = item.slug || item.link;
      const title = item.name || item.title || item.metaTitle;
      if (!link || !title) continue;

      const titleKey = String(title).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seenLink.has(link) || seenTitle.has(titleKey)) continue;
      seenLink.add(link);
      seenTitle.add(titleKey);

      const writer = String(item.writer_name || "").trim();
      out.push({
        id: item._id || link,
        title,
        href: base + link,
        image: item.file?.path || null,
        // Publisher for coverage; flagged as authored when the director wrote it.
        source: writer || "Inframantra",
        authored: writer ? pattern.test(writer) : false,
        date: formatDate(item.publishDate || item.createdAt || item.updatedAt),
        kind,
      });
    }
  }

  // Pieces they wrote lead, then press coverage.
  out.sort((a, b) => Number(b.authored) - Number(a.authored));
  return out.slice(0, limit);
}

/** Company testimonials (shared across both directors). */
export async function fetchTestimonials(apiUrl1, limit = 6) {
  if (!apiUrl1) return [];
  const json = await safeJson(`${apiUrl1}/testimonials/get`);
  const arr = json?.data || json?.result || [];
  const list = Array.isArray(arr) ? arr : arr?.data || [];

  return list
    .filter((t) => t && (t.description || t.name))
    .slice(0, limit)
    .map((t) => ({
      id: t._id || t.name,
      name: t.name || "",
      quote: String(t.description || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
      image: t.image || null,
    }));
}
