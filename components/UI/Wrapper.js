import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import NavigationBar from '../newComponents/UI/header';
import FooterNavigation from '../newComponents/UI/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = ({
  schema,
  title = 'Infra Mantra',
  description = 'Infra Mantra',
  keyword = 'Infra Mantra',
  image = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg',
  location: metaLoc = 'Infra Mantra',
  seo = 'index, follow',
  type = "",
  name = "",
  ...props
}) => {
  const router = useRouter();

  /** Canonical URL */
  const canonicalUrl = useMemo(() => {
    return (
      'https://inframantra.com' +
      (router.asPath === '/' ? '' : router.asPath.split('?')[0])
    );
  }, [router.asPath]);

  /** Scroll to top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);

  /** Update meta description, OG & Twitter dynamically (CLIENT-SIDE) */
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
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'INFRAMANTRA',
        url: 'https://inframantra.com/',
        logo: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91 86 9800 9900',
          contactType: 'customer service',
          contactOption: 'TollFree',
          areaServed: 'IN',
          availableLanguage: ['en', 'Hindi'],
        },
        sameAs: [
          'https://www.facebook.com/inframantraofficial',
          'https://x.com/INFRAMANTRA_',
          'https://www.instagram.com/inframantraofficial/',
          'https://www.youtube.com/@inframantraofficial',
          'https://in.linkedin.com/company/inframantra',
          'https://in.pinterest.com/inframantraofficial/',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'INFRAMANTRA',
        url: 'https://inframantra.com/',
        potentialAction: {
          '@type': 'SearchAction',
          target: '{search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    if (schema) {
      base.push(
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: schema.name || 'Property',
          image: schema.image || image,
          url: `https://inframantra.com${schema.url || '/'}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: `${schema.price || 0}.0`,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: schema.loc || 'Location',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: schema.lat || 0,
            longitude: schema.lon || 0,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Residence',
          name: schema.name || 'Residence',
          address: {
            '@type': 'PostalAddress',
            addressLocality: schema.loc,
            addressRegion: schema.sub,
          },
        }
      );
    }

    return base;
  }, [schema, image]);

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
        <meta key="viewport" name="viewport" content="width=device-width, user-scalable=no" />

  {/* Structured Data */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Lexend+Deca:wght@100..900&display=swap"
          rel="stylesheet"
        />        {structuredData.map((entry, i) => (
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

      {/* GTM */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MR3WQND');
          `,
        }}
      />

      <main className="main">
        <NavigationBar
          selectedItems={props.selectedItem}
          toggleSelection={props.toggleSelection}
          pageBgd={router.pathname !== '/'}
        />
        {props.children}
      </main>

      <FooterNavigation />
      <ToastContainer position="top-right" autoClose={2000} pauseOnHover theme="light" />
    </div>
  );
};

export default Wrapper;
