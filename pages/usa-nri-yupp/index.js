import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Wrapper from '../../components/UI/Wrapper';
import Header from '../../components/nri/header';
import AboutSection from '../../components/nri/aboutSection';
import UpcomingProjectsSection from '../../components/nri/projectSlider';
import WhyInvest from '../../components/nri/WhyInvest';
import Faq from '../../components/nri/FAQ';
import ProjecMap from '../../components/nri/ProjectMap';
import Sticky from '../../components/nri/StickySidebar';
import PopFormNew from '../../components/detailSections/POPUPCTA';

function Nri() {

  const router = useRouter();

  const { source } = router.query;

  // ============================================
  // POPUP STATE
  // ============================================
  const [showPopup, setShowPopup] = useState(true);

  // Total popup count
  const popupCountRef = useRef(1);

  // Last popup close time
  const lastCloseTimeRef = useRef(Date.now());

  // Project section trigger flag
  const projectTriggeredRef = useRef(false);

  // =========================
  // STORE SOURCE
  // =========================
 useEffect(() => {

    if (typeof window === "undefined") return;

    // If source exists in URL
    if (source) {
      localStorage.setItem("source", source);
    } else {
       localStorage.setItem("source", "YUPP");
    }

  }, [source]);

  // =========================
  // STORE YUPP TV FLAG + DUMMY UTM
  // =========================
  useEffect(() => {

    if (typeof window === "undefined") return;

    try {

      const utmData = JSON.parse(
        localStorage.getItem("utm_params")
      ) || {};

      const dummyUtm = {
        utm_source: "yupptv",
        utm_medium: "cpc",
        utm_campaign: "USA_EXPO_YUPP_TV",
        utm_term: "nri-property",
        utm_content: "banner_ad",
        region: "YUPP"
      };

      const updatedUtm = {
        ...utmData,
        ...dummyUtm
      };

      localStorage.setItem(
        "utm_params",
        JSON.stringify(updatedUtm)
      );

      localStorage.setItem(
        "campaign_platform",
        "YUPP TV"
      );

      console.log(
        "Dummy UTM Added:",
        updatedUtm
      );

    } catch (err) {

      console.log(err);

    }

  }, []);

  // =========================
  // STICKY SIDEBAR
  // =========================
  useEffect(() => {

    const header =
      document.getElementById('nriHeader');

    const sidebar =
      document.querySelector('.sidebarst');

    const elements =
      document.querySelector('.cta_visible');

    if (elements) {
      elements.style.display = 'none';
    }

    if (!header || !sidebar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {

        sidebar.style.display =
          entry.isIntersecting
            ? 'none'
            : 'flex';

      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(header);

    return () => {

      observer.disconnect();

      // Restore CTA
      if (elements) {
        elements.style.display = 'flex';
      }

    };

  }, []);

  // ============================================
  // POPUP FLOW
  // 1st => immediate
  // 2nd => when project section visible
  // 3rd => 15 sec after second close
  // ============================================
  useEffect(() => {

    const projectSection =
      document.getElementById('nriProject');

    if (!projectSection) return;

    let interval;

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (
          entry.isIntersecting &&
          !projectTriggeredRef.current
        ) {

          projectTriggeredRef.current = true;

          // Second popup
          if (popupCountRef.current < 3) {

            setShowPopup(true);

            popupCountRef.current += 1;

          }

          // Third popup after 15 sec
          interval = setInterval(() => {

            const currentTime = Date.now();

            const diff =
              currentTime -
              lastCloseTimeRef.current;

            if (
              diff >= 15000 &&
              popupCountRef.current < 3
            ) {

              setShowPopup(true);

              popupCountRef.current += 1;

            }

            // Stop interval
            if (popupCountRef.current >= 3) {
              clearInterval(interval);
            }

          }, 1000);

        }

      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(projectSection);

    return () => {

      observer.disconnect();

      if (interval) {
        clearInterval(interval);
      }

    };

  }, []);

  // ============================================
  // HANDLE POPUP CLOSE
  // ============================================
  const handlePopupClose = (value) => {

    setShowPopup(value);

    lastCloseTimeRef.current = Date.now();

  };

  // =========================
  // DEBUG
  // =========================
  useEffect(() => {

    console.log(
      'Campaign Source:',
      source
    );

  }, [source]);

  return (

    <Wrapper
      title="Gurgaon Premium Luxury Residences for NRIs | INFRAMANTRA"
      description="Explore Gurgaon premium luxury residences for NRIs with INFRAMANTRA. Discover top projects, exclusive pricing, and secure high-return real estate investments."
      seo="noindex"
    >

      {/* HEADER */}
      <section id="nriHeader">
        <Header name="USA-EXPO YUPP TV" />
      </section>

      {/* ABOUT */}
      <section id="NriAbout">
        <AboutSection name="USA-EXPO YUPP TV" />
      </section>

      {/* PROJECTS */}
      <section id="nriProject">
        <UpcomingProjectsSection
          name="USA-EXPO YUPP TV"
        />
      </section>

      {/* MAP */}
      <ProjecMap />

      {/* WHY INVEST */}
      <WhyInvest name="USA-EXPO YUPP TV" />

      {/* FAQ */}
      <Faq name="USA-EXPO YUPP TV" />

      {/* STICKY SIDEBAR */}
      <Sticky name="USA-EXPO YUPP TV" />

      {/* POPUP */}
      <PopFormNew
        popUpenable={showPopup}
        onClickOff={handlePopupClose}
        name="USA-EXPO YUPP TV"
        id="nri-popup-form"
      />

    </Wrapper>
  );
}

export default Nri;