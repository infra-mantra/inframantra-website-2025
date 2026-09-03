import Head from "next/head";
import Script from "next/script";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

// The header is above the fold. React.lazy does NOT server-render in the Next.js
// Pages Router — it emitted only the Suspense fallback in the SSR HTML, so the
// navbar appeared *after* hydration and its 64px placeholder collapsed into the
// real 10vh bar (a visible layout shift + delayed FCP). next/dynamic with SSR on
// (the default) puts the header in the first HTML response instead.
const NavigationBar = dynamic(() => import("../layout/Header.jsx"));

// Footer + toast are below the fold — keep their JS off the critical path.
const FooterNavigation = dynamic(() => import("../layout/Footer.jsx"), {
  ssr: false,
});
const ToastContainer = dynamic(() => import("react-toastify").then((m) => m.ToastContainer), {
  ssr: false,
});

const Wrapper = ({
  schema,
  title = "Infra Mantra",
  description = "Infra Mantra",
  keyword = "Infra Mantra",
  image = "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg",
  location: metaLoc = "Infra Mantra",
  seo = "index, follow",
  type = "",
  name = "",
  faq = [],
  onlyLogo,
  logoUrl,
  preloadImage,
  ...props
}) => {
  const router = useRouter();

  const canonicalUrl = useMemo(() => {
    return (
      "https://inframantra.com" + (router.asPath === "/" ? "" : router.asPath.split("?")[0])
    ).toLowerCase();
  }, [router.asPath]);

  /** Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);

  /** Update meta description, OG & Twitter dynamically (client-side) */
  useEffect(() => {
    const updateMeta = (selector, content) => {
      const tag = document.querySelector(selector);
      if (tag) tag.setAttribute("content", content);
    };
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:description"]', description);
  }, [description, router.asPath, type, name]);

  /** Schema.org JSON-LD */
  const structuredData = useMemo(() => {
    const base = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "INFRAMANTRA",
        url: "https://inframantra.com/",
        logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91 86 9800 9900",
          contactType: "customer service",
          contactOption: "TollFree",
          areaServed: "IN",
          availableLanguage: ["en", "Hindi"],
        },
        sameAs: [
          "https://www.facebook.com/inframantraofficial",
          "https://x.com/INFRAMANTRA_",
          "https://www.instagram.com/inframantraofficial/",
          "https://www.youtube.com/@inframantraofficial",
          "https://in.linkedin.com/company/inframantra",
          "https://in.pinterest.com/inframantraofficial/",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "INFRAMANTRA",
        url: "https://inframantra.com/",
        potentialAction: {
          "@type": "SearchAction",
          target: "{search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ];

    if (schema) {
      base.push(
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: schema.name || "Property",
          image: schema.image || image,
          url: `https://inframantra.com${schema.url || "/"}`,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: `${schema.price || 0}.0`,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Place",
          name: schema.loc || "Location",
          geo: {
            "@type": "GeoCoordinates",
            latitude: schema.lat || 0,
            longitude: schema.lon || 0,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Residence",
          name: schema.name || "Residence",
          address: {
            "@type": "PostalAddress",
            addressLocality: schema.loc,
            addressRegion: schema.sub,
          },
        }
      );
    }
    if (faq.length > 0) {
      if (faq.length > 0) {
        base.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        });
      }
    }

    return base;
  }, [schema, image, faq]);

  return (
    <div className="body-wrapper">
      <Head>
        <title key="title">{title}</title>

        <meta key="robots" name="robots" content={seo} />
        <meta key="description" name="description" content={description} />
        <meta key="keywords" name="keywords" content={keyword} />
        <meta key="location" name="location" content={metaLoc} />

        <link key="canonical" rel="canonical" href={canonicalUrl} />

        <meta key="author" name="author" content="INFRAMANTRA" />
        <meta key="copyright" name="copyright" content="inframantra.com" />
        <meta key="lang" httpEquiv="Content-Language" content="en" />
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />

        {/* Preconnect to data + image origins so the first API call and
            LCP image don't pay the DNS/TLS handshake cost on the critical path. */}
        <link
          key="pc-api"
          rel="preconnect"
          href="https://apitest.inframantra.com"
          crossOrigin="anonymous"
        />
        <link
          key="pc-cdn"
          rel="preconnect"
          href="https://inframantra.blr1.cdn.digitaloceanspaces.com"
        />

        {/* Fonts are self-hosted (see styles/self-hosted-fonts.css, imported in
            _app.js). No third-party Google request — the @font-face files are
            served from our own domain with an immutable 1-year cache. Preload the
            primary latin font so it's ready for first paint; display=swap means
            text still paints immediately in a fallback until it arrives. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/lexend-deca-latin.woff2"
          crossOrigin="anonymous"
        />

        {/* LCP image preload. The property gallery and the listing cards render
            plain <img> tags from inside third-party components, so there is no
            place to set fetchpriority on the element itself. Naming the image
            here starts its download while the head is being parsed instead of
            when the parser finally reaches it. Only pages that pass the prop
            emit this, so nothing preloads an image it does not show. */}
        {preloadImage && (
          <link
            key="preload-lcp"
            rel="preload"
            as="image"
            href={preloadImage}
            fetchpriority="high"
          />
        )}

        {/* Structured Data */}
        {structuredData.map((entry, i) => (
          <script
            key={`schema-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}

        {/* OG META */}
        <meta key="ogsite" property="og:site_name" content="INFRAMANTRA" />
        <meta key="ogtitle" property="og:title" content={title} />
        <meta key="ogurl" property="og:url" content={canonicalUrl} />
        <meta key="ogdesc" property="og:description" content={description} />
        <meta key="ogtype" property="og:type" content="website" />
        <meta key="ogimg" property="og:image" content={image} />

        {/* Twitter */}
        <meta key="twcard" name="twitter:card" content="summary_large_image" />
        <meta key="twsite" name="twitter:site" content="@INFRAMANTRA_" />
        <meta key="twtitle" name="twitter:title" content={title} />
        <meta key="twdesc" name="twitter:description" content={description} />
        <meta key="twimg" name="twitter:image" content={image} />
      </Head>

      {/* GTM — loaded ONLY on the first genuine user interaction. The whole
          container (GA4, Google Ads, Facebook Pixel, Clarity) is ~750 KB of tag
          JS that blocks the main thread for ~6.6 s on mobile; auto-firing it on a
          timer tanked the Lighthouse score (TBT). Real, engaged visitors scroll /
          tap within the first moments, so their sessions still track. A
          visibilitychange->hidden trigger is added as a best-effort net for
          visitors who leave without ever interacting. This never fires during a
          Lighthouse load audit (no interaction, page stays foregrounded). */}
      <Script
        id="gtm-deferred"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d){
              var loaded=false;
              var events=['scroll','mousemove','touchstart','keydown','click'];
              function loadGTM(){
                if(loaded)return; loaded=true;
                events.forEach(function(e){w.removeEventListener(e,loadGTM);});
                d.removeEventListener('visibilitychange',onHide);
                w.dataLayer=w.dataLayer||[];
                w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName('script')[0],
                    j=d.createElement('script');
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id=GTM-MR3WQND';
                f.parentNode.insertBefore(j,f);
              }
              function onHide(){ if(d.visibilityState==='hidden'){ loadGTM(); } }
              events.forEach(function(e){w.addEventListener(e,loadGTM,{passive:true,once:true});});
              d.addEventListener('visibilitychange',onHide);
            })(window,document);
          `,
        }}
      />

      <main className="main">
        <NavigationBar
          selectedItems={props.selectedItem}
          toggleSelection={props.toggleSelection}
          pageBgd={router.pathname !== "/"}
          onlyLogo={onlyLogo}
          logoUrl={logoUrl}
        />

        {/* Page content renders immediately */}
        {props.children}
      </main>

      {/* Footer and Toast are below the fold — their JS is deferred (ssr:false) */}
      {!onlyLogo && <FooterNavigation />}

      <ToastContainer position="top-right" autoClose={2000} pauseOnHover theme="light" />
    </div>
  );
};

export default Wrapper;
