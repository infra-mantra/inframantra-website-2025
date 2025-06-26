
import React, {useState, useEffect, lazy } from "react";


import Wrapper from "../components/UI/Wrapper";
import moment from "moment/moment";



import MainBanner1 from '../components/newComponents/homepage/MainBanner.js';
import FeaturedProperties from '../components/newComponents/featuredProperties/featuredProperties'
import PopularLocalities from "../components/newComponents/popularLocalities/popularLocalities.js";
import ServiceSection from '../components/newComponents/serviceSection/serviceSection.js';
import StatisticalInsightsSection from "../components/newComponents/statisticalInsights/staticalInsight";
import ImageGallerySection from "../components/newComponents/imageGallery/imageGallerySection";
import ClientTestimonySection from "../components/newComponents/clientTestimonySection/clientTestimonySection.jsx";
import ContactUsSection from "../components/newComponents/contactUsSection/contactUsSection.jsx";

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

  // console.log("locality", allData.locality);

  // console.log("From New Inframantra MAin");




  return (
    
    <Wrapper
      title={'INFRAMANTRA -Top Real Estate Company in Gurgaon, Noida and Pune'}
      description={'INFRAMANTRA is the best real estate company in Gurugram, Noida, and Pune, offering residential, commercial properties, and apartments/flats with expert consulting.'}
      keyword={'InfraMantra, Residential Properties, Commercial Properties,  Apartments, Flats, Buy flat in gurgaon, buy property in gurgaon,gurgaon property prices, Apartments for sale in gurugram, buy apartment in gurgaon, buy Properties in gurgaon, real estate in gurgaon, best property to buy in gurgaon, noida   apartment for sale, Pune property prices, buy property noida, buy residential property in pune, Property for purchase in gurugram'}
      selectedItem={selectedItems}
    >
      {/* <NewPoPUp /> */}
      <MainBanner1 />
      <FeaturedProperties />
      <PopularLocalities />
      <ServiceSection />
      <StatisticalInsightsSection />
      <ImageGallerySection />
      <ClientTestimonySection />
      <ContactUsSection />
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

  // const topLocalityData = data.result.toplocality
  // const topLocalityDataArray = []
  // topLocalityData.forEach(function(p){
  //   topLocalityDataArray.push({
  //     "id": p._id,
  //     "name": p.name,
  //     ...(p.projectDetail && {"projectDetail": p.projectDetail}),
  //   })
  // })

  const allData = {
    "meta": meta,
    "heading": heading,
    "cities": cityDataArray,
    "propertyTypes" : propertyTypeDataArray,
    "recommendation": recommendedDataArray,
    "collection": collectionDataArray,
    "featuredProjects": data.result.featureProducts,
    "services": data.result.services,
    "help": helpDataArray,
    "blogs": blogDataArray,
    "testimonial": testimonialDataArray,
    "partners": partnerDataArray,
    "topLocality": data.result.topLocality,
  }
  return {
    props: {
      allData,
    },
    revalidate: 10,
  }
}

export default Home
