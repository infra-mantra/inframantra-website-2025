import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// Wrapper MUST server-render. It wraps every section of this page, so ssr:false
// meant the HTML carried no property content at all (0.9 KB of markup, 57
// visible chars) and FCP/LCP could not happen until ~1 MB of JS had downloaded,
// parsed and hydrated. With the default ssr:true the content ships in the first
// response, which is what the skeleton was papering over.
const Wrapper = dynamic(() => import("../../components/shared/Wrapper.jsx"));

import PropertyHeaderImageGallery from "../../components/property-detail/PropertyHeaderImageGallery.jsx";
import PropertyHeader from "../../components/property-detail/PropertyHeaderContent.jsx";
// ReactPlayer (~68 KB) backs this and the video is below the fold — keep it off
// the critical path.
const PropertyVideoYoutube = dynamic(
  () => import("../../components/property-detail/PropertyVideo.jsx"),
  { ssr: false }
);
import PropertySectionNavbar from "../../components/property-detail/NavBar.jsx";
import Amenities from "../../components/property-detail/Amenities.jsx";
import LandMark from "../../components/property-detail/Landmark.jsx";
import Config from "../../components/property-detail/Config.jsx";
import EmiCalculator from "../../components/property-detail/EmiCalculator.jsx";
import PremiumProperty from "../../components/property-detail/PremiumPropertyList.jsx";
import Sitevisit from "../../components/property-detail/SiteVisitBanner.jsx";
import Developer from "../../components/property-detail/Developer.jsx";
import FaqSection from "../../components/property-detail/Faq.jsx";
import CtaForHome from "../../components/shared/forms/SinglePropertyCta.jsx";
// Only mounts after 50% scroll, so it is never part of the initial render.
const PopUpForm = dynamic(() => import("../../components/shared/forms/CTANEW.jsx"), { ssr: false });

const PropertyDetail = ({ allData }) => {
  const router = useRouter();
  const { utm_campaign } = router.query;

  const rightRef = useRef(null);

  const [locoScroll, setLocoScroll] = useState(null);
  const [propertyData, setPropertyData] = useState(allData.propertyData.data);
  const [popForm, setPopForm] = useState(false);

  // =========================
  // CLOSE HANDLER
  // =========================
  const onClickOff = (val) => {
    setPopForm(val);
  };

  // =========================
  // 60% SCROLL POPUP (REFRESH SAFE FINAL FIX)
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyClosed = localStorage.getItem("popFormClosed");
    if (alreadyClosed) return;

    let triggered = false;

    const checkScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrollPercentage = (scrollTop / (docHeight - windowHeight)) * 100;

      if (scrollPercentage >= 50 && !triggered) {
        triggered = true;
        setPopForm(true);
      }
    };

    const init = () => {
      // wait for full layout + images
      requestAnimationFrame(() => {
        setTimeout(() => {
          checkScroll(); // 👈 handles refresh case
        }, 500);

        window.addEventListener("scroll", checkScroll);
      });
    };

    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init);
    }

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("load", init);
    };
  }, []);

  // =========================
  // PROPERTY DATA
  // =========================
  useEffect(() => {
    setPropertyData(allData.propertyData.data);
  }, [allData]);

  // =========================
  // UTM TRACKING
  // =========================
  useEffect(() => {
    if (!router.isReady) return;
    if (typeof window === "undefined") return;

    if (utm_campaign === "KC_Searchad_26May") {
      localStorage.setItem("source", utm_campaign);
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
      preloadImage={schemaInfo.image}
    >
      <div className="propertyPageWrapper">
        <PropertyHeaderImageGallery
          imageGallery={propertyData.imageGallery}
          propertyData={propertyData}
          projectName={schemaInfo.name}
        />

        <section id="Highlights">
          <PropertyHeader propertyData={propertyData} name={schemaInfo.name} />
        </section>

        <PropertySectionNavbar locoScroll={locoScroll} />

        <div className="property-page">
          <div className="property-left">
            <section>
              <PropertyVideoYoutube videoUrl={propertyData?.videoUrl?.[0]} />
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
                pdf={propertyData?.brochure?.[0]}
                name={propertyData.name}
              />
            </section>

            <section id="EMI Calculator">
              <EmiCalculator price={propertyData?.priceInFigure} name={propertyData.name} />
            </section>

            <section>
              <PremiumProperty city={schemaInfo.city} />
            </section>

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

        <PopUpForm
          popUpenable={popForm}
          onClickOff={onClickOff}
          text="TO CONNECT WITH OUR PROPERTY ADVISOR"
          name={schemaInfo.name}
          id="propertyIndividualPopUp"
        />
      </div>
    </Wrapper>
  );
};

// Nothing is prerendered at build time. This route sets a short `revalidate`,
// so any page built during `next build` is stale within seconds and gets
// regenerated on demand anyway — prerendering all ~113 of them (plus the slug-list
// fetches) only made the build slower without changing steady-state behaviour.
// `fallback: "blocking"` means the first request for a slug renders on the server
// and is cached from then on, which is what happened after the revalidate window
// regardless.
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
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
