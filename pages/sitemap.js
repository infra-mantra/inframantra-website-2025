import fs from "fs";
import path from "path";
import Link from "next/link";
import Wrapper from "../components/shared/Wrapper.jsx";
import styles from "./sitemap.module.css";

/**
 * Human-readable HTML sitemap at /sitemap (the machine-readable XML stays at
 * /sitemap.xml).
 *
 * The link list is generated at build time from the same public/sitemap-*.xml
 * files the crawlers read, rather than being maintained by hand, so the two can
 * never disagree. Regenerating the XML sitemaps updates this page on the next
 * revalidate with no code change.
 */
const SECTIONS = [
  { file: "sitemap-core.xml", title: "Main Pages" },
  { file: "sitemap-listings.xml", title: "Property Listings" },
  { file: "sitemap-properties.xml", title: "Properties" },
  { file: "sitemap-blogs.xml", title: "Blog" },
  { file: "sitemap-news.xml", title: "News" },
  { file: "sitemap-press-releases.xml", title: "Press Releases" },
];

const SiteMapPage = ({ sections, total }) => (
  <Wrapper
    title="Sitemap | Infra Mantra"
    description="Browse every page on Inframantra — properties, city and locality listings, blog articles, news and press releases."
    keyword="Inframantra sitemap, site index, all properties, all localities"
  >
    <div className={styles.sitemapPage}>
      <header className={styles.sitemapHeader}>
        <h1 className={styles.sitemapTitle}>Sitemap</h1>
        <p className={styles.sitemapIntro}>
          Every page on Inframantra, grouped by section — {total} links in total.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className={styles.sitemapSection}>
          <h2 className={styles.sectionTitle}>
            {section.title}
            <span className={styles.sectionCount}>{section.links.length}</span>
          </h2>
          <ul className={styles.linkList}>
            {section.links.map((link) => (
              <li key={link.href} className={styles.linkItem}>
                <Link href={link.href}>
                  <a className={styles.link}>{link.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </Wrapper>
);

/** "/property/godrej-habitat-sector-3-gurgaon" -> "Godrej Habitat Sector 3 Gurgaon" */
const labelFor = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return "Home";
  let last = segments[segments.length - 1];
  try {
    last = decodeURIComponent(last);
  } catch {
    // leave a malformed escape sequence as-is rather than throwing the build
  }
  return last
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export async function getStaticProps() {
  const dir = path.join(process.cwd(), "public");
  const sections = [];

  for (const { file, title } of SECTIONS) {
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) continue;

    const xml = fs.readFileSync(full, "utf8");
    const seen = new Set();
    const links = [];

    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      let pathname;
      try {
        pathname = new URL(match[1].trim()).pathname;
      } catch {
        continue; // skip a malformed <loc>
      }
      if (seen.has(pathname)) continue;
      seen.add(pathname);
      links.push({ href: pathname, label: labelFor(pathname) });
    }

    links.sort((a, b) => a.label.localeCompare(b.label));
    if (links.length) sections.push({ title, links });
  }

  return {
    props: {
      sections,
      total: sections.reduce((sum, s) => sum + s.links.length, 0),
    },
    revalidate: 3600,
  };
}

export default SiteMapPage;
