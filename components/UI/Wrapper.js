import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NavigationBar from '../newComponents/UI/header';
import FooterNavigation from '../newComponents/UI/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = (props) => {
  const {
    schema,
    title = 'Infra Mantra',
    description = 'Infra Mantra',
    keyword = 'Infra Mantra',
    image = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg',
    location: metaLoc = 'Infra Mantra',
  } = props;

  const router = useRouter();
  const pathname = router.pathname;
  const canonicalUrl = ('https://inframantra.com' + (router.asPath === '/' ? '' : router.asPath)).split('?')[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const structuredData = [
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
      '@context': 'https://schema.org/',
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
    structuredData.push(
      {
        '@context': 'https://schema.org/',
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
        '@context': 'https://schema.org/',
        '@type': 'Place',
        name: 'coordinates',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: schema.lat,
          longitude: schema.lon,
        },
      },
      {
        '@context': 'https://schema.org/',
        '@type': 'Residence',
        name: 'Residence',
        address: {
          '@type': 'PostalAddress',
          addressLocality: schema.loc,
          addressRegion: schema.sub,
        },
      }
    );
  }

  return (
    <div className="body-wrapper">
      <Head>
        <title>{title}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="location" content={metaLoc} />
        <meta name="author" content="INFRAMANTRA" />
        <meta name="copyright" content="inframantra.com" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Lexend+Deca:wght@100..900&display=swap"
          rel="stylesheet"
        />
        {structuredData.map((entry, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
        ))}
        <meta property="og:site_name" content="INFRAMANTRA" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@INFRAMANTRA_" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>

      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
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
          pageBgd={pathname !== '/'}
        />
        {props.children}
      </main>

      <FooterNavigation />

      <ToastContainer position="top-right" autoClose={2000} pauseOnHover theme="light" />
    </div>
  );
};

export default Wrapper;
