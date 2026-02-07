import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

/* -------------------------------------------------------
   ESM dirname support
------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const slugify = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* -------------------------------------------------------
   Static routes
------------------------------------------------------- */
const staticRoutes = [
  "/",
  "/page/disclaimer",
  "/page/privacy-policy",
  "/page/terms-conditions",
  "/page/user-agreement",
  "/about-us",
  "/our-services",
  "/testimonials",
  "/careers",
  "/blog",
  "/contact-us",
];

/* -------------------------------------------------------
   Manual routes (blog + developer pages)
------------------------------------------------------- */
const fetchDynamicRoutes = async () => [
  "/blog/aqua-line-noida-metro-extension-11-new-aqua-line-metro-stations",
  "/blog/best-luxurious-properties-for-sale-in-sector-79-gurgaon",
  "/blog/best-residential-projects-in-the-posh-areas-of-gurgaon",
  "/blog/why-noida-is-the-perfect-place-for-your-dream-home",
  "/blog/top-5-places-to-live-in-gurugram",
  "/blog/best-tips-to-become-a-successful-real-estate-investor-in-2024",
  "/property/bestech-altura-sector-79-gurgaon",
  "/property/ambience-creacions-sector-22-gurugram",
];

const fetchDeveloperRoutes = async () => [
  "/developer/godrej-properties",
  "/developer/eldeco-group",
  "/developer/prateek-group",
  "/developer/ats-infrastructure-limited",
  "/developer/bhutani-infra",
  "/developer/lodha-group",
  "/developer/gera-developments",
  "/developer/pride-group",
  "/developer/mahindra-lifespaces",
  "/developer/vtp-realty",
  "/developer/kohinoor-group",
  "/developer/kolte-patil-developers-limited",
  "/developer/nyati-group",
  "/developer/vilas-javdekar-developers",
  "/developer/krisumi-corporation",
  "/developer/emaar-properties",
  "/developer/m3m-india",
  "/developer/signature-global",
  "/developer/central-park",
  "/developer/tribeca-developers",
];

/* -------------------------------------------------------
   SAFE paginated fetch (no total dependency)
------------------------------------------------------- */
const fetchPaginatedData = async (url, params = {}, dataField = "result") => {
  let page = 1;
  const limit = params.limit || 50;
  const allData = [];

  while (true) {
    try {
      const { data } = await axios.get(url, {
        params: { ...params, page, limit },
        timeout: 15000,
      });

      const pageData = data?.[dataField] || [];

      if (!pageData.length) break;

      allData.push(...pageData);
      page++;
    } catch (err) {
      console.error(`❌ API failed: ${url} (page ${page})`);
      console.error(err.message);
      break;
    }
  }

  return allData;
};

/* -------------------------------------------------------
   MAIN sitemap generator
------------------------------------------------------- */
const generateSitemap = async () => {
  console.log("🚀 Starting sitemap generation...");

  const baseUrl = "https://inframantra.com";
  const publicDir = path.resolve(__dirname, "../public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  // Ensure /public exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    const [
      dynamicRoutes,
      developerRoutes,
      properties,
      cities,
      developers,
    ] = await Promise.all([
      fetchDynamicRoutes(),
      fetchDeveloperRoutes(),
      fetchPaginatedData(
        "https://apitest.inframantra.com/api/v1/property/propertylist",
        { limit: 50 },
        "result"
      ),
      fetchPaginatedData(
        "https://apitest.inframantra.com/api/v1/property/cities",
        { limit: 50 },
        "result"
      ),
      fetchPaginatedData(
        "https://apitest.inframantra.com/api/v1/developer/alldevelopers",
        { limit: 50 },
        "result"
      ),
    ]);

    console.log("📊 API Data:");
    console.log("Properties:", properties.length);
    console.log("Cities:", cities.length);
    console.log("Developers:", developers.length);

    const propertyRoutes = properties
      .filter((p) => p?.slug)
      .map((p) => `/property/${p.slug}`);

    const cityRoutes = cities
      .filter((c) => c?.name)
      .map((c) => `/property-listing/city/${slugify(c.name)}`);

    const devListingRoutes = developers
      .filter((d) => d?.name)
      .map((d) => `/property-listing/developer/${slugify(d.name)}`);

    // Deduplicate URLs
    const allRoutes = Array.from(
      new Set([
        ...staticRoutes,
        ...dynamicRoutes,
        ...developerRoutes,
        ...propertyRoutes,
        ...cityRoutes,
        ...devListingRoutes,
      ])
    );

    const today = new Date().toISOString().split("T")[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <priority>${
      route === "/"
        ? "1.00"
        : route.startsWith("/property/")
        ? "0.90"
        : route.startsWith("/developer")
        ? "0.60"
        : "0.80"
    }</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemap.trim(), "utf8");

    console.log("✅ Sitemap generated successfully!");
    console.log("📍 Location:", sitemapPath);
    console.log("🔗 Total URLs:", allRoutes.length);
  } catch (err) {
    console.error("❌ Sitemap generation failed");
    console.error(err);
  }
};

generateSitemap();
