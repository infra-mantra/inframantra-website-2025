import React, {
  useEffect,
  useRef,
  useState
} from 'react';

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

  const { utm_content } = router.query;

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
 
   }, [router.isReady,utm_content ]);

  // ============================================
  // POPUP STATE
  // ============================================
  const [showPopup, setShowPopup] = useState(true);

  const popupCountRef = useRef(1);
  const lastCloseTimeRef = useRef(Date.now());
  const projectTriggeredRef = useRef(false);

  // ============================================
  // HEADER / SIDEBAR OBSERVER
  // ============================================
  useEffect(() => {

    const header = document.getElementById('nriHeader');
    const sidebar = document.querySelector('.sidebarst');
    const elements = document.querySelector('.cta_visible');

    if (elements) {
      elements.style.display = 'none';
    }

    if (!header || !sidebar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {

        sidebar.style.display =
          entry.isIntersecting ? 'none' : 'flex';

      },
      { threshold: 0.1 }
    );

    observer.observe(header);

    return () => observer.disconnect();

  }, []);

  // ============================================
  // PROJECT SECTION POPUP LOGIC
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

          if (popupCountRef.current < 3) {

            setShowPopup(true);
            popupCountRef.current += 1;

          }

          interval = setInterval(() => {

            const diff =
              Date.now() - lastCloseTimeRef.current;

            if (
              diff >= 15000 &&
              popupCountRef.current < 3
            ) {

              setShowPopup(true);
              popupCountRef.current += 1;

            }

            if (popupCountRef.current >= 3) {
              clearInterval(interval);
            }

          }, 1000);

        }

      },
      { threshold: 0.3 }
    );

    observer.observe(projectSection);

    return () => {

      observer.disconnect();

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

    <Wrapper
      title="Gurgaon Premium Luxury Residences for NRIs | INFRAMANTRA"
      description="Explore Gurgaon premium luxury residences for NRIs with INFRAMANTRA. Discover top projects, exclusive pricing, and secure high-return real estate investments."
      seo="noindex"
    >

      {/* HEADER */}
      <section id="nriHeader">
        <Header name="USA-EXPO (Event Specific)" />
      </section>

      {/* ABOUT */}
      <section id="NriAbout">
        <AboutSection name="USA-EXPO (Event Specific)" />
      </section>

      {/* PROJECT */}
      <section id="nriProject">
        <UpcomingProjectsSection
          name="USA-EXPO (Event Specific)"
        />
      </section>

      <ProjecMap />

      <WhyInvest />

      <Faq name="USA-EXPO (Event Specific)" />

      <Sticky name="USA-EXPO (Event Specific)" />

      {/* POPUP */}
      <PopFormNew
        popUpenable={showPopup}
        onClickOff={handlePopupClose}
        name="USA-EXPO (Event Specific)"
        id="nri-popup-form"
      />

    </Wrapper>
  );
}

export default Nri;