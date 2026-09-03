import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import EventInfo from "../../components/events/EventInfo.jsx";
import Sticky from "../../components/nri/StickySidebar.jsx";
import Wrapper from "../../components/shared/Wrapper.jsx";
import EventGallery from "../../components/events/FormGallery.jsx";
import Header from "../../components/events/HeaderSec.jsx";
import AboutEvent from "../../components/events/AboutEvent.jsx";
import PopFormNew from "../../components/shared/forms/POPUPCTA.jsx";

function UsaExpoEvent() {
  const router = useRouter();

  const { utm_content } = router.query;

  // ============================================
  // POPUP STATE
  // ============================================
  const [showPopup, setShowPopup] = useState(true);

  const popupCountRef = useRef(1);
  const lastCloseTimeRef = useRef(Date.now());

  // ============================================
  // STORE SOURCE FROM UTM
  // ============================================
  useEffect(() => {
    if (!router.isReady) return;
    if (typeof window === "undefined") return;
    if (utm_content === "KC") {
      localStorage.setItem("source", "google");
    } else {
      localStorage.setItem("source", "ADS");
    }
  }, [router.isReady, utm_content]);

  // ============================================
  // SIDEBAR
  // ============================================
  useEffect(() => {
    const elements = document.querySelector(".cta_visible");

    if (elements) {
      elements.style.display = "none";
    }

    return () => {
      if (elements) {
        elements.style.display = "flex";
      }
    };
  }, []);

  // ============================================
  // SECOND POPUP AFTER 15 SEC
  // ============================================
  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      const diff = Date.now() - lastCloseTimeRef.current;

      if (diff >= 15000 && popupCountRef.current < 2) {
        setShowPopup(true);

        popupCountRef.current += 1;

        clearInterval(interval);
      }
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // ============================================
  // HANDLE CLOSE
  // ============================================
  const handlePopupClose = (value) => {
    setShowPopup(value);
    lastCloseTimeRef.current = Date.now();
  };

  return (
    <>
      <Wrapper
        title="USA Expo for NRIs | Luxury Residences in India | INFRAMANTRA"
        description="Explore luxury residences in India at the Inframantra USA Expo for NRIs. Discover premium investment opportunities with expert guidance—limited seats available."
        seo="noindex"
      >
        {/* HEADER */}
        <Header name="USA-EXPO (Event Specific)" />

        {/* ABOUT */}
        <AboutEvent name="USA-EXPO (Event Specific)" />

        {/* GALLERY */}
        <EventGallery />

        {/* EVENT INFO */}
        <EventInfo />

        {/* STICKY */}
        <Sticky name="USA-EXPO (Event Specific)" url="/usa-nri" />

        {/* POPUP */}
        <PopFormNew
          popUpenable={showPopup}
          onClickOff={handlePopupClose}
          name="USA-EXPO (Event Specific)"
          id="usa-expo-popup"
        />
      </Wrapper>
    </>
  );
}

export default UsaExpoEvent;
