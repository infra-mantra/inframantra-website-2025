import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NavigationBar from '../newComponents/UI/header';
import FooterNavigation from '../newComponents/UI/footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = (props) => {
  const { schema, title, description, keyword, image, location: metaLoc } = props;
  const router = useRouter();
  const pathname = router.pathname;
  const canonicalUrl = ('https://inframantra.com' + (router.asPath === '/' ? '' : router.asPath)).split('?')[0];


 


  useEffect(() => window.scrollTo(0, 0), [pathname]);

  const addJson = () => ({
    __html: `
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "INFRAMANTRA",
        "url": "https://inframantra.com/",
        "logo": "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91 86 9800 9900",
          "contactType": "customer service",
          "contactOption": "TollFree",
          "areaServed": "IN",
          "availableLanguage": ["en","Hindi"]
        },
        "sameAs": [
          "https://www.facebook.com/inframantraofficial",
          "https://x.com/INFRAMANTRA_",
          "https://www.instagram.com/inframantraofficial/",
          "https://www.youtube.com/@inframantraofficial",
          "https://in.linkedin.com/company/inframantra",
          "https://in.pinterest.com/inframantraofficial/"
        ]
      }
    `,
  });

  const addJson2 = () => ({
    __html: `
      {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": "INFRAMANTRA",
        "url": "https://inframantra.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "{search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    `,
  });

  const addJson3 = (props) => ({
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: props.name || 'Property',
      image: props.image || 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png',
      url: `https://inframantra.com${props.url || '/'}`,
      offers: {
        "@type": "Offer",
        priceCurrency: 'INR',
        price: `${props.price || 0}.0`,
      },
    }),
  });

  const addJson4 = (props) => ({
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Place",
      name: 'coordinates',
      geo: {
        "@type": "GeoCoordinates",
        latitude: props.lat,
        longitude: props.lon,
      },
    }),
  });

  const addJson5 = (props) => ({
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Residence",
      name: 'Residence',
      address: {
        "@type": "PostalAddress",
        addressLocality: props.loc,
        addressRegion: props.sub,
      },
    }),
  });

  return (
    <div className="body-wrapper">
      <Head>
        <meta name="robots" content="index, follow" />
        <title>{title || 'Infra Mantra'}</title>
        <meta name="description" content={description || 'Infra Mantra'} />
        <meta name="keywords" content={keyword || 'Infra Mantra'} />
        <meta name="location" content={metaLoc || 'Infra Mantra'} />
        <meta name="author" content="INFRAMANTRA" />
        <meta name="copyright" content="inframantra.com" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width,user-scalable=no" />
        <link rel="canonical" href={canonicalUrl} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CCBX4PWTKJ"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CCBX4PWTKJ');
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({
            'gtm.start':new Date().getTime(), event:'gtm.js'
          });
          var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
          j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MR3WQND');
        `}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={addJson()} />
        <script type="application/ld+json" dangerouslySetInnerHTML={addJson2()} />
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={addJson3({...schema, image})} />}
        {(pathname === '/property/[propertyId]' || pathname === '/thank-you') && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16667923552"></script>
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16667923552');
            `}} />
          </>
        )}
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={addJson4(schema)} />}
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={addJson5(schema)} />}
        <meta property="og:site_name" content="INFRAMANTRA" />
        <meta property="og:title" content={title || 'INFRAMANTRA - Making Realty A Reality For You'} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:description" content={description || 'Infra Mantra description'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image || 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@INFRAMANTRA_" />
        <meta name="twitter:title" content={title || 'INFRAMANTRA - Making Realty A Reality For You'} />
        <meta name="twitter:description" content={description || 'Infra Mantra description'} />
        <meta name="twitter:image" content={image || 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg'} />
      </Head>

      <main className="main">
        <NavigationBar selectedItems={props.selectedItem} toggleSelection={props.toggleSelection} pageBgd={pathname !== '/'} />
        {props.children}
      </main>

      {(pathname === '/thank-you') && (
        <Script dangerouslySetInnerHTML={{ __html: `
          if(typeof gtag === 'function'){
            gtag('event','conversion',{'send_to':'AW-16667923552/kjRoCIa1xKkaEOCo8Ys-'});
          }
        `}} />
      )}

      <FooterNavigation />
    

      <ToastContainer position="top-right" autoClose={2000} pauseOnHover theme="light" />
    </div>
  );
};

export default Wrapper;
