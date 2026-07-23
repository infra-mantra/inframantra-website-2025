
import React, {useState, useEffect, lazy } from "react";


import Wrapper from "../components/UI/Wrapper";
import Head from "next/head";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import MainBanner1 from '../components/newComponents/homepage/MainBanner.js';
import LazyOnVisible from "../components/UI/LazyOnVisible";

// Premium Picks is the ONLY eager Swiper consumer on the homepage, and it renders
// nothing but a loading spinner on the server anyway (its data is fetched
// client-side via axios). Deferring it with ssr:false pulls Swiper + its whole
// subtree out of the initial JS/hydration path — the biggest single TBT win here.
// The placeholder reserves the section's exact height (628/578px) so there is no
// layout shift when the chunk mounts.
const PremiumPropertyMainComponent = dynamic(
  () => import("../components/newComponents/premiumPicks/PremiumPropertyMainComponent.jsx"),
  {
    ssr: false,
    loading: () => <div className="homePremiumPlaceholder" aria-hidden="true" />,
  }
);

// Below-the-fold sections: code-split AND deferred (ssr:false). They are wrapped
// in <LazyOnVisible> in the render tree, so their chunks download + hydrate only
// when the user scrolls near them — keeping this JS off the initial load, which
// is where Total Blocking Time (the biggest mobile-score factor) is won.
const StatisticalInsightsSection = dynamic(() => import("../components/newComponents/statisticalInsights/staticalInsight"), { ssr: false });
const ImageGallerySection = dynamic(() => import("../components/newComponents/imageGallery/imageGallerySection"), { ssr: false });
const ReviewsWall = dynamic(() => import("../components/newComponents/reviewsWall/ReviewsWall.jsx"), { ssr: false });
const BlogsMedia = dynamic(() => import("../components/newComponents/blogsSection/blogsMedia.js"), { ssr: false });
const CtaForHome = dynamic(() => import("../components/detailSections/ctaForHome.js"), { ssr: false });


function Home({allData}) {
  const bannerItems = [
    {
      image: allData.meta.bannerImage,
      title: allData.meta.bannerTitle,
    },
  ];

  const [exclusiveCollection, setExclusiveCollection] = useState(allData.recommendation)
  const [featureCollection, setFeatureCollection] = useState(allData.collection)
  const [featuredProduct, setfeaturedProduct] = useState(allData.featuredProjects)




  const [selectedItems, setSelectedItems] = useState([]);

  // Function to save selectedItems to localStorage
  const loadSelectedItemsFromLocalStorage = () => {
    try {
      const selectedItemsJSON = localStorage.getItem('selectedItems');
      return selectedItemsJSON ? JSON.parse(selectedItemsJSON) : [];
    } catch (error) {
      console.error("Error loading selected items from localStorage:", error);
      return [];
    }
  };
  
  const saveSelectedItemsToLocalStorage = (selectedItems) => {
    try {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    } catch (error) {
      console.error("Error saving selected items to localStorage:", error);
    }
  };
  
  // ...
  
  useEffect(() => {
    // Load selectedItems from localStorage when the component mounts
    setSelectedItems(loadSelectedItemsFromLocalStorage());
  }, []); // Empty dependency array means this effect runs once, like componentDidMount

  const toggleSelection = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
  
    if (isSelected) {
      const updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem._id !== item._id);
      setSelectedItems(updatedSelectedItems);
      saveSelectedItemsToLocalStorage(updatedSelectedItems);
    } else {
      const updatedSelectedItems = [...selectedItems, item];
      setSelectedItems(updatedSelectedItems);
      saveSelectedItemsToLocalStorage(updatedSelectedItems);
    }
  };





  return (
    
     <Wrapper
      title={'INFRAMANTRA - Making Realty A Reality For You'}
      description={'INFRAMANTRA is a Real Estate Firm that helps to Build Value on Residential and Commercial properties. We work with the top Builders in Gurgaon, Pune, and Noida.'}
      keyword={'InfraMantra, Residential Properties, Commercial Properties,  Apartments, Flats, Buy flat in gurgaon, buy property in gurgaon,gurgaon property prices, Apartments for sale in gurugram, buy apartment in gurgaon, buy Properties in gurgaon, real estate in gurgaon, best property to buy in gurgaon, noida   apartment for sale, Pune property prices, buy property noida, buy residential property in pune, Property for purchase in gurugram'}
      selectedItem={selectedItems}
    >
      <Head>
        {/* Preload the LCP hero image so it downloads immediately (matches the
            <picture> in the banner: desktop vs mobile source). */}
        <link
          rel="preload"
          as="image"
          href="https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/whiteland-b.webp"
          media="(min-width: 769px)"
          fetchpriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/WESTIN-mobile.webp"
          media="(max-width: 768px)"
          fetchpriority="high"
        />
      </Head>
      <MainBanner1 />
      <PremiumPropertyMainComponent/>
      <LazyOnVisible minHeight={520}><BlogsMedia /></LazyOnVisible>
      <LazyOnVisible minHeight={480}><StatisticalInsightsSection /></LazyOnVisible>
      <LazyOnVisible minHeight={520}><ImageGallerySection /></LazyOnVisible>
      <LazyOnVisible minHeight={520}><ReviewsWall current={allData.testimonial} /></LazyOnVisible>
      <LazyOnVisible minHeight={420}><CtaForHome name={'Form Submitted from Home page'} /></LazyOnVisible>
    </Wrapper>
  );
}



export async function getStaticProps() {
  const res = await fetch(`${process.env.apiUrl}/home?city=635b68b7c6c1fe18701d3020`)
  const data = await res.json()

  const headingsData = data.result.homeHeading[0]
  const heading = {
    "description": headingsData.description,
    "featureHeading": headingsData.featureHeading,
    "featureDescription": headingsData.featureDescription,
    "collectionHeading": headingsData.collectionHeading,
    "collectionDescription": headingsData.collectionDescription,
    "serviceHeading": headingsData.serviceHeading,
    "serviceDescription": headingsData.serviceDescription,
    "helpHeading": headingsData.helpHeading,
    "helpDescription": headingsData.helpDescription,
    "blogHeading": headingsData.blogHeading,
    "blogDescription": headingsData.blogDescription,
    "heading": headingsData.heading,
    "topHeading": headingsData.topHeading,
    "topDescription": headingsData.topDescription,
    "testHeading": headingsData.testHeading,
    "testDescription": headingsData.testDescription,
    "partnerHeading": headingsData.partnerHeading,
    "partnerDescription": headingsData.partnerDescription,
  }

  const meta = {
    "meta_title": data.result.meta[0].meta_title,
    "meta_description": data.result.meta[0].meta_description,
    "bannerTitle": data.result.meta[0].title,
    "bannerDesp": data.result.meta[0].description,
    "bannerImage": data.result.meta[0].file.path
  }

  const propertyTypeData = data.result.categoryList
  const propertyTypeDataArray = []
  propertyTypeData.forEach(function(c){
    propertyTypeDataArray.push({
      "id": c._id,
      "title": c.name
    })
  })

  const cityData = data.result.cityList
  const cityDataArray = []
  cityData.forEach(function(c){
    cityDataArray.push({
      "id": c._id,
      "title": c.name,
      "file": c.file.path,
    })
  })

  // const localityData = data.result.localityList
  // const localityArray = []
  // localityData.forEach(function(c){
  //   localityArray.push({
  //     "id" : c._id,
  //     "name": c.name,
  //     "slug": c.slug
  //   })
  // })

  const recommendedData = data.result.recommendations
  const recommendedDataArray = []
  recommendedData.forEach(function(r){
    recommendedDataArray.push({
      "id": r._id,
      "title": r.name,
      ...(r.image && r.image.length > 0 && {"image": r.image[0].path}),
      "location": r.location,
      "apartments": r.apartments,
      "price": r.price,
      ...(r.slug && {"slug": r.slug}),
      "amenities": r.amenities,
      ...(r.developer && r.developer.file && {"developerImage": r.developer.file.path}),
      "description": r.product_description,
      "textSpecialPrice": r.textSpecialPrice,
      "sizesqft": r.sizesqft,
      "possession_status": r.possession_status.name,
    })
  })

  const collectionData = data.result.feartureCollection
  const collectionDataArray = []
  collectionData.forEach(function(c){
    collectionDataArray.push({
      "id": c.iteam._id,
      "title": c.iteam.name,
      "description": c.iteam.description,
      ...(c.iteam.slug && {"slug": c.iteam.slug}),
      ...(c.iteam.file && {"image": c.iteam.file.path}),
      "type": c.type
    })
  })

  const helpData = data.result.infraHelps
  const helpDataArray = []
  helpData.forEach(function(h){
    helpDataArray.push({
      "id": h._id,
      "title": h.name,
      "description": h.description,
      ...(h.file && {"image": h.file.path})
    })
  })

  const blogData = data.result.blogList
  const blogDataArray = []
  blogData.forEach(function(b){
    
      blogDataArray.push({
        "id": b._id,
        "title": b.name,
        "description": b.shortDescription,
        ...(b.thumbnail && {"image": b.thumbnail.path}),
        "date": moment(b.publish ? b.publish : b.createdAt).format('MMM DD YYYY'),
        "slug": b.slug,
      })
    
  })

  const testimonialData = data.result.testimonials
  const testimonialDataArray = []
  testimonialData.forEach(function(t){
    testimonialDataArray.push({
      "id": t._id,
      "name": t.name,
      "description": t.description,
      "designation": t.designation,
      ...(t.youtube &&  {"youtube": t.youtube}),
    })
  })

  const partnerData = data.result.homePartners
  const partnerDataArray = []
  partnerData.forEach(function(p){
    partnerDataArray.push({
      "id": p._id,
      "name": p.name,
      ...(p.slug && {"slug": p.slug}),
      ...(p.file &&  {"image": p.file.path}),
      ...(p.city &&  {"city": p.city}),
    })
  })



  // The homepage's sections all fetch their own data client-side; the only
  // getStaticProps data the rendered tree actually consumes is `meta` (banner)
  // and `testimonial` (ReviewsWall). The rest was ~200 KB of dead JSON shipped in
  // __NEXT_DATA__ on every request, bloating the HTML and slowing mobile
  // download/parse/hydrate. recommendation/collection/featuredProjects are kept
  // as [] only because the component still initialises (unused) state from them.
  const allData = {
    "meta": meta,
    "recommendation": [],
    "collection": [],
    "featuredProjects": [],
    "testimonial": testimonialDataArray,
  }
  return {
    props: {
      allData,
    },
    revalidate: 10,
  }
}

export default Home
