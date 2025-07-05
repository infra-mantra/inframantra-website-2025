import { useEffect, useState } from 'react';
import Head from 'next/head'
import FormLoader from './FormLoader';
import Image from 'next/image';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import Ajax from '../helper/Ajax';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';


import NavigationBar from '../newComponents/UI/header';
import FooterNavigation from '../newComponents/UI/footer';
const Wrapper = (props) => {

  const {schema} = props;
 




  const addJsonData3 = (props) => {
    const schemaJson = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name":props?.name || 'Property', 
      "image":props?.image || 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png',
      "url": `https://inframantra.com`+props?.url, 
      "offers": { 
        "@type": "Offer",
        "priceCurrency": `INR`,
        "price": `${props?.price}.0`,
      },
    };
  
    return {
      __html: JSON.stringify(schemaJson), 
    };
  };
  
  const addJsonData4 = (props) => {
    const schemaJson = {
      "@type":"Place",
       "name":"coordinates",
      "@context":"https://schema.org/",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": props?.lat, 
        "longitude": props?.lon, 
      },
    };
  
    return {
      __html: JSON.stringify(schemaJson), 
    };
  };
  
  const addJsonData5 = (props) => {
    const schemaJson = {
      "@context":"https://schema.org/",
      "name":"Residence ",
      "@type":"Residence",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": props?.loc, 
        "addressRegion": props?.sub, 
      },
    };
  
    return {
      __html: JSON.stringify(schemaJson), 
    };
  };
  


  
  const router = useRouter()
  const pathname = router.pathname

  const canonicalUrl = (`https://inframantra.com` + (router.asPath === "/" ? "" : router.asPath)).split("?")[0];
  const sendFormData = async (values) => {
    const formData = {
      "name": values.full_name,
      "phone": `${values.contact_number}`,
      "email": values.email,
      ...(router.pathname !== '/home-interiors' && router.pathname !== '/property-buying' && { "type": "REQUEST" })
    }
    const enquiryForm = await Ajax({
      url: router.pathname === '/home-interiors' ? '/enquiry/interior' : router.pathname === '/property-buying' ? '/enquiry/buying' : '/enquiry',
      method: 'POST',
      data: formData,
      loader: true
    })
    if (enquiryForm.data.status === 'SUCCESS!') {
      toast.success('Enquiry submitted successfully')
      document.querySelector(".enquiry-popup-bg").classList.remove("show")
      document.querySelector(".enquiry-popup").classList.remove("show")
    }
  }


  const addJsonData = () => {
    return {
      __html: `
      {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "INFRAMANTRA",
    "url": "https://inframantra.com/",
    "logo": "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 86 9800 9900",
      "contactType": "customer service",
      "contactOption": "TollFree",
      "areaServed": "IN",
      "availableLanguage": ["en", "Hindi"]
    },
    "sameAs": [
      "https://www.facebook.com/inframantraofficial",
      "https://x.com/INFRAMANTRA_",
      "https://www.instagram.com/inframantraofficial/",
      "https://www.youtube.com/@inframantraofficial",
      "https://in.linkedin.com/company/inframantra",
      "https://in.pinterest.com/inframantraofficial/",
      "https://inframantra.com/"
    ]
  }
      `
    }
  }
  const addJsonData2 = () => {
    return {
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
      `
    }
  }
 


  
  const addTagData2 = () => {
    return {
      __html: `
        (function (w, d, s, l, i) {
          w[l] = w[l] || []; w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
          }); var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-MR3WQND');
      `
    }
  };



  const [showSecondaryHeader, setShowSecondaryHeader] = useState(false);
  useEffect(() => {
    // Check the current route and determine if you want to show the secondary header.
    if (router.pathname === `/property/[propertyId]`) {
      setShowSecondaryHeader(true);
    } else {
      setShowSecondaryHeader(false);
    }
  }, [router.pathname]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768); 
    setIsMobile(window.innerWidth <= 768);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);




  const allowedPaths = ['/', '/listing', '/developers', '/developer/[developerId]'];


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  const isHomePage = router.pathname === "/";



  return (
    <div className="body-wrapper">
      <Head>
        <meta name="robots" content="index, follow" />
        <title>{props.title ? props.title : 'Infra Mantra'}</title>
        <meta name="description" content={props.description ? props.description : 'Infra Mantra'} />
        {/* <meta name="keywords" content={props.keyword ? props.keyword : 'Infra Mantra'} />  */}
        <meta name="keywords" content={props.keyword ? props.keyword : "Infra Mantra"} />
        <meta name="location" content={props.location ? props.location : "Infra Mantra"} />
        <meta name="author" content="INFRAMANTRA" />
        <meta name="copyright" content="inframantra.com" />
        <meta http-equiv="Content-Language" content="en" />
         <meta name="viewport" content="width=device-width, user-scalable=no"/>



      <script dangerouslySetInnerHTML={addTagData2()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={addJsonData()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={addJsonData2()} />
     
      {schema &&
        (<script
        type="application/ld+json"
        dangerouslySetInnerHTML={addJsonData3({...schema,image:props.image})}
      />)
      }
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


     
        {schema &&
        (<script
        type="application/ld+json"
        dangerouslySetInnerHTML={addJsonData4({...schema,image:props.image})}
      />)}
        {schema &&
        (<script
        type="application/ld+json"
        dangerouslySetInnerHTML={addJsonData5({...schema,image:props.image})}
      />)}

    

      
        <link rel="canonical" href={canonicalUrl} />
        {/* <script id='google-analytics' strategy="afterInteractive" type="application/ld+json" dangerouslySetInnerHTML={addJsonData2()} key='item-JsonData'></script>
        <script id='google-analytics' strategy="afterInteractive" type="application/ld+json" dangerouslySetInnerHTML={addJsonData()} key='item-JsonData2'></script> */}
        <meta property="og:site_name" content="INFRAMANTRA" />
        <meta property="og:title" content={props.title ? props.title : "INFRAMANTRA - Making Realty A Reality For You"} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:description" content={props.description ? props.description : "INFRAMANTRA is a Real Estate Firm that helps to Build Value on Commercial and Residential properties. We work with the top Builders in Gurgaon, Pune, and Noida. "} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={props.image ? props.image : 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@INFRAMANTRA_" />
        <meta name="twitter:title" content={props.title ? props.title : "INFRAMANTRA - Making Realty A Reality For You"} />
        <meta name="twitter:description" content={props.description ? props.description : "INFRAMANTRA is a Real Estate Firm that helps to Build Value on Commercial and Residential properties. We work with the top Builders in Gurgaon, Pune, and Noida. "} />
        <meta name="twitter:image" content={props.image ? props.image : 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Inframantra-Web-OG-Image.jpg'} />





        
      </Head>
      
      <main className="main">
        {/* <Header selectedItems={props.selectedItem} toggleSelection={props.toggleSelection}/> */}
        {/* {showSecondaryHeader ? <PageHeader detail={props.detail}/> : <Header selectedItems={props.selectedItem} toggleSelection={props.toggleSelection}/>} */}
        {isDesktop ? (
          <NavigationBar selectedItems={props.selectedItem} toggleSelection={props.toggleSelection} pageBgd={!isHomePage} />
        ) : (
          showSecondaryHeader ? <NavigationBar detail={props.detail} pageBgd={!isHomePage} /> : <NavigationBar selectedItems={props.selectedItem} toggleSelection={props.toggleSelection} pageBgd={!isHomePage} />
        )}
        <FormLoader />
        {props.children}
       
      </main>
      
      {pathname === '/thank-you' && (
       <script dangerouslySetInnerHTML={{ __html: `
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {'send_to': 'AW-16667923552/kjRoCIa1xKkaEOCo8Ys-'});
    }
  `}} />
)}



      

      {/* <Footer adjustStickBtns={props.adjustStickBtns}/> */}
      <FooterNavigation />
     

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
    
  );
    

};

export default Wrapper;
