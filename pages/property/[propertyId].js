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

const PropertyDetail = ({ allData }) => {
  const router = useRouter();
  const rightRef = useRef(null);
  const containerRef = useRef(null);
  const [locoScroll, setLocoScroll] = useState(null);
 const [propertyData, setPropertyData] = useState(allData.propertyData.data);

useEffect(() => {
  setPropertyData(allData.propertyData.data);
}, [allData.propertyData.data]);

  const [schemaInfo] = useState({
    lat: propertyData?.coordinates?.lat,
    lon: propertyData?.coordinates?.lng,
    loc: propertyData.locality?.name,
    sub: propertyData.subLocality?.name,
    url: router.asPath || null,
    price: propertyData.priceInFigure,
    city: propertyData.city?.name,
    image: propertyData.imageGallery?.[0]?.url || null,
    Galleryimages: propertyData.imageGallery,
    name: propertyData.name,
  });




  return (
    <Wrapper
      title={`${propertyData.metaTitle} | Infra Mantra`}
      description={propertyData.metaDescription}
      keyword={propertyData.metaKeywords}
      image={schemaInfo.image}
      schema={schemaInfo}
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
              <LandMark propertyInfo={schemaInfo} propertyData={propertyData}/>
            </section>

            <section id="Plan & Pricing" >
              <Config  floorPlan={propertyData.floorPlan} pdf={propertyData.brochure[0]} name={schemaInfo.name}/>
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
            <CtaForHome name={schemaInfo.name}/>
          </div>
     
        </div>
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
