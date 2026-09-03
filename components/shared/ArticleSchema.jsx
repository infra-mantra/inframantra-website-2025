import Head from "next/head";

const BASE_URL = "https://inframantra.com";
const PUBLISHER_LOGO =
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogoBlack(2).webp";

/**
 * BlogPosting / NewsArticle / Article JSON-LD for a blog, news or PR detail page.
 *
 * It's just plain text emitted into <head> at build time (SSG) — no JavaScript,
 * no images and no network requests — so it has zero effect on page speed.
 */
export default function ArticleSchema({ detail, type = "BlogPosting", path }) {
  if (!detail || !detail.title) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${path}` },
    headline: detail.title,
    ...(detail.metaDescription ? { description: detail.metaDescription } : {}),
    ...(detail.image ? { image: detail.image } : {}),
    author: { "@type": "Organization", name: "INFRAMANTRA", url: `${BASE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "INFRAMANTRA",
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
    ...(detail.date ? { datePublished: detail.date } : {}),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
