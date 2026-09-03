import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Wrapper = dynamic(() => import("../../components/shared/Wrapper.jsx"), { ssr: false });

import PropertyHeaderImageGallery from "../../components/property-detail/PropertyHeaderImageGallery.jsx";
import PropertyHeader from "../../components/property-detail/PropertyHeaderContent.jsx";
import PropertyVideoYoutube from "../../components/property-detail/PropertyVideo.jsx";
import PropertySectionNavbar from "../../components/property-detail/NavBar.jsx";
import Amenities from "../../components/property-detail/Amenities.jsx";
import LandMark from "../../components/property-detail/Landmark.jsx";
import Config from "../../components/property-detail/Config.jsx";
import PremiumProperty from "../../components/property-detail/PremiumPropertyList.jsx";
import Sitevisit from "../../components/property-detail/SiteVisitBanner.jsx";
import Developer from "../../components/property-detail/Developer.jsx";
import FaqSection from "../../components/property-detail/Faq.jsx";
import CtaForHome from "../../components/shared/forms/SinglePropertyCta.jsx";
import PopUpForm from "../../components/shared/forms/CTANEW.jsx";

const PropertyDetail = ({ allData }) => {
  const router = useRouter();
  const { utm_campaign } = router.query;

  const rightRef = useRef(null);
  const containerRef = useRef(null);
  const [locoScroll, setLocoScroll] = useState(null);
  const [propertyData, setPropertyData] = useState(allData.propertyData.data);
  const [popForm, setPopForm] = useState(false);
  const onClickOff = (val) => setPopForm(val);
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

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof window === "undefined") return;
    if (utm_campaign === "KC_Searchad_26May") {
      localStorage.setItem("source", utm_campaign);
    } else {
      localStorage.setItem("source", "google");
    }
  }, [router.isReady, utm_campaign]);

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
      onlyLogo={true}
      logoUrl={propertyData.developer.developerImg}
    >
      <div className="propertyPageWrapper">
        <PropertyHeaderImageGallery
          imageGallery={propertyData.imageGallery}
          propertyData={propertyData}
          search={false}
        />
        <section id="Highlights">
          <PropertyHeader propertyData={propertyData} name={schemaInfo.name} />
        </section>

        <PropertySectionNavbar locoScroll={locoScroll} />

        <div className="property-page">
          <div className="property-left">
            <section>
              <PropertyVideoYoutube videoUrl={propertyData.videoUrl[0]} />
            </section>

            <section id="Amenities">
              <Amenities propertyData={propertyData} />
            </section>

            <section id="Locality">
              <LandMark
                propertyInfo={schemaInfo}
                propertyData={propertyData}
                name={propertyData.name}
              />
            </section>

            <section id="Plan & Pricing">
              <Config
                floorPlan={propertyData.floorPlan}
                pdf={propertyData.brochure[0]}
                name={propertyData.name}
              />
            </section>
            {/* <section >
              <PremiumProperty city={schemaInfo.city}/>
            </section> */}

            <section>
              <Sitevisit name={schemaInfo.name} />
            </section>

            <section id="About Developer">
              <Developer propertyData={propertyData} />
            </section>

            <section id="FAQ's">
              <FaqSection propertyData={propertyData} name={schemaInfo.name} />
            </section>
          </div>

          <div className="property-right" ref={rightRef}>
            <CtaForHome name={schemaInfo.name} id="propertyIndividualRightForm" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.apiUrl1}/property/slug/godrej-samaris-sector-53-gurgaon`);
  const data = await res.json();

  return {
    props: {
      allData: { propertyData: data },
    },
    revalidate: 10,
  };
}

export default PropertyDetail;
