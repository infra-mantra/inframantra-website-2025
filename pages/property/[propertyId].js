import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Wrapper = dynamic(() => import("../../components/UI/Wrapper"), { ssr: false });

import PropertyHeaderImageGallery from "../../components/newComponents/propertyIndividualPage/PropertyHeaderImageGallery";
import PropertyHeader from "../../components/newComponents/propertyIndividualPage/propertyHeaderContent";
import PropertyVideoYoutube from "../../components/newComponents/propertyData/propertyRightSection/propertyVideo";
import PropertySectionNavbar from "../../components/newComponents/propertyIndividualPage/navBar";
import Amenities from "../../components/newComponents/propertyIndividualPage/amenities";
import LandMark from "../../components/newComponents/propertyIndividualPage/landmark";
import Config from "../../components/newComponents/propertyIndividualPage/config";
import PremiumProperty from "../../components/newComponents/propertyIndividualPage/premiumPropertyList";
import Sitevisit from "../../components/newComponents/propertyIndividualPage/siteVisitBanner";
import Developer from "../../components/newComponents/propertyIndividualPage/developer";
import FaqSection from "../../components/newComponents/propertyIndividualPage/faq";
import CtaForHome from "../../components/detailSections/singlePropertyCta";
import PopUpForm from '../../components/detailSections/CTA_NEW'


const PropertyDetail = ({ allData }) => {
 const router = useRouter();
const { utm_campaign } = router.query;


  const rightRef = useRef(null);
  const containerRef = useRef(null);
  const [locoScroll, setLocoScroll] = useState(null);
 const [propertyData, setPropertyData] = useState(allData.propertyData.data);
  const [popForm, setPopForm] = useState(false);
        const onClickOff = (val) =>setPopForm(val)
        const handleform = () => setPopForm(true);
        useEffect(() => {
  const alreadyClosed = localStorage.getItem("popFormClosed");

  if (!alreadyClosed) {
    const timer = setTimeout(() => {
      setPopForm(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }
}, []);

useEffect(() => {
  setPropertyData(allData.propertyData.data);
}, [allData]);


  // ============================================
  // STORE SOURCE FROM UTM
  // ============================================
  useEffect(() => {

    if (!router.isReady) return;
    if (typeof window === "undefined") return;
    if (utm_campaign === "KC_Searchad_26May") {
      localStorage.setItem("source", utm_campaign);
    } 
  }, [router.isReady,utm_campaign ]);

const schemaInfo = {
  lat: propertyData?.coordinates?.lat,
  lon: propertyData?.coordinates?.lng,
  loc: propertyData?.locality?.name,
  sub: propertyData?.subLocality?.name,
  url: router.asPath || null,
  price: propertyData?.priceInFigure,
  city: propertyData?.city?.name,
  image: propertyData?.imageGallery?.[0]?.url || null,
  Galleryimages: propertyData?.imageGallery,
  name: propertyData?.name,
};





  return (
    <Wrapper
      title={`${propertyData.metaTitle} | Infra Mantra`}
      description={propertyData.metaDescription}
      keyword={propertyData.metaKeywords}
      image={schemaInfo.image}
      schema={schemaInfo}
      faq={propertyData.faqs}
    >
      <div className="propertyPageWrapper" >
        <PropertyHeaderImageGallery imageGallery={propertyData.imageGallery} propertyData={propertyData}/>
       <section id="Highlights">
      <PropertyHeader propertyData={propertyData}  name={schemaInfo.name}/>
          </section>

        <PropertySectionNavbar locoScroll={locoScroll}  />

        <div className="property-page">
          <div className="property-left">
            <section >
              <PropertyVideoYoutube videoUrl={propertyData.videoUrl[0]}/>
            </section>

            <section  id= "Amenities" >
              <Amenities propertyData={propertyData}/>
            </section>

            <section id= "Locality" >
              <LandMark propertyInfo={schemaInfo} propertyData={propertyData} name={propertyData.name} />
            </section>

            <section id="Plan & Pricing" >
              <Config  floorPlan={propertyData.floorPlan} pdf={propertyData.brochure[0]} name={propertyData.name}/>
            </section>
              <section >
              <PremiumProperty city={schemaInfo.city}/>
            </section>
            
            <section >
              <Sitevisit  name={schemaInfo.name}/>
            </section>

            <section id="About Developer" >
              <Developer propertyData={propertyData} />
            </section>
  
            <section id= "FAQ's" >
              <FaqSection propertyData={propertyData} name={schemaInfo.name}  />
            </section>

          

          </div>

          <div className="property-right" ref={rightRef}>
            <CtaForHome name={schemaInfo.name} id="propertyIndividualRightForm"/>
          </div>
     
        </div>
          <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="TO CONNECT WITH OUR PROPERTY ADVISOR "
        name={schemaInfo.name}
        id="propertyIndividualPopUp"
        />
      </div>
    </Wrapper>
  );
};

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl1}/property/slugList?active=true`);
  const data = await res.json();

  const paths = data.result.map((post) => ({
    params: { propertyId: post.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.apiUrl1}/property/slug/${params.propertyId}`);
  const data = await res.json();

  return {
    props: {
      allData: { propertyData: data },
    },
    revalidate: 10,
  };
}

export default PropertyDetail;
