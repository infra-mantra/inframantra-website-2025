import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const slugify = str =>
  str
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const staticRoutes = [
  "/", "/page/disclaimer", "/page/privacy-policy", "/about-us", "/our-services",
  "/testimonials", "/careers", "/blog", "/contact-us", "/page/terms-conditions", "/page/user-agreement"
];

const fetchDynamicRoutes = async () => [
  "/blog/aqua-line-noida-metro-extension-11-new-aqua-line-metro-stations",
  "/blog/best-luxurious-properties-for-sale-in-sector-79-gurgaon",
  "/blog/best-residential-projects-in-the-posh-areas-of-gurgaon",
  "/blog/why-noida-is-the-perfect-place-for-your-dream-home",
  "/blog/top-5-places-to-live-in-gurugram",
  "/blog/best-tips-to-become-a-successful-real-estate-investor-in-2024",
  "/property/bestech-altura-sector-79-gurgaon",
  "/property/ambience-creacions-sector-22-gurugram"
];

const fetchDeveloperRoutes = async () => [
  "/developer/godrej-properties", "/developer/eldeco-group", "/developer/prateek-group",
  "/developer/ats-infrastructure-limited", "/developer/bhutani-infra", "/developer/lodha-group",
  "/developer/gera-developments", "/developer/pride-group", "/developer/mahindra-lifespaces",
  "/developer/vtp-realty", "/developer/kohinoor-group", "/developer/kolte-patil-developers-limited",
  "/developer/nyati-group", "/developer/vilas-javdekar-developers", "/developer/krisumi-corporation",
  "/developer/emaar-properties", "/developer/m3m-india", "/developer/signature-global",
  "/developer/central-park", "/developer/tribeca-developers"
];

const fetchPaginatedData = async (url, params = {}, dataField = 'result') => {
  let page = 1;
  const limit = params.limit || 10;
  const allData = [];
  let totalItems = 0;

  try {
    const initialResponse = await axios.get(url, { params: { ...params, page, limit } });
    totalItems = initialResponse.data.total || initialResponse.data[dataField]?.length || 0;
    if (initialResponse.data[dataField]) {
      allData.push(...initialResponse.data[dataField]);
    }
  } catch (err) {
    console.error(`Failed to fetch page 1 from ${url}`, err.message);
    return [];
  }

  const totalPages = Math.ceil(totalItems / limit);
  while (++page <= totalPages) {
    try {
      const response = await axios.get(url, { params: { ...params, page, limit } });
      if (response.data[dataField]) {
        allData.push(...response.data[dataField]);
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page} from ${url}`, err.message);
      await delay(2000);
    }
  }

  return allData;
};

const generateSitemap = async () => {
  const baseUrl = "https://inframantra.com";
  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');

  if (fs.existsSync(sitemapPath)) {
    fs.unlinkSync(sitemapPath);
  }

  try {
    const [dynamicRoutes, developerRoutes, properties, cities, developers] = await Promise.all([
      fetchDynamicRoutes(),
      fetchDeveloperRoutes(),
      fetchPaginatedData("https://apitest.inframantra.com/api/v1/property/propertylist", { limit: 50 }, "result"),
      fetchPaginatedData("https://apitest.inframantra.com/api/v1/property/cities", { limit: 50 }, "result"),
      fetchPaginatedData("https://apitest.inframantra.com/api/v1/developer/alldevelopers", { limit: 50 }, "result")
    ]);

    const propertyRoutes = properties
      .filter(p => p.slug)
      .map(p => `/property/${p.slug}`);

    const cityRoutes = cities
      .filter(c => c.name)
      .map(c => `/property-listing/city/${slugify(c.name)}`);

    const devRoutes = developers
      .filter(d => d.name)
      .map(d => `/property-listing/developer/${slugify(d.name)}`);

    const allRoutes = [
      ...staticRoutes,
      ...dynamicRoutes,
      ...developerRoutes,
      ...propertyRoutes,
      ...cityRoutes,
      ...devRoutes
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${route === '/' ? '1.00' : route.startsWith('/developer') ? '0.50' : '0.80'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemap.trim(), 'utf8');
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err.message);
  }
};

generateSitemap();
