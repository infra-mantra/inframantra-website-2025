import React, { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import "../styles/responsive.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/bundle";
import "swiper/css";
import "../styles/newHome.css";
import "../styles/filter.css";
import "../styles/dropDownMenu.css"
import '../styles/PropertyHeaderImageGallery.css'
import '../styles/properyHeader.css'
import '../styles/propertyCard.css'
import '../styles/RightSlideModal.css'
import '../styles/config.css'
import '../styles/fullview.css'
import '../styles/brochureDownload.css'
import '../styles/site-visite.css'
import '../styles/developer.css'

import styles from '../styles/_app.module.css'
import '../styles/navbarsticky.css'
import '../styles/amenities.css'
import '../styles/landmark.css'

import "../styles/pageHeader.module.css";
import '../styles/map.css'

import ErrorStack from "./_error.js";

// UTM parameters we want to track and persist
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Client error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorStack statusCode={500} />;
    }
    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const [isMobile, setIsMobile] = React.useState(false);

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // ============================
  // UTM PERSISTENCE LOGIC
  // ============================
  useEffect(() => {
    // Step 1: On first load, check URL for UTMs and save them to sessionStorage
    const params = new URLSearchParams(window.location.search);
    const utmsFromUrl = {};
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) utmsFromUrl[key] = value;
    });

    if (Object.keys(utmsFromUrl).length > 0) {
      sessionStorage.setItem("utm_params", JSON.stringify(utmsFromUrl));
    }
  }, []);

  useEffect(() => {
    // Step 2: On every route change, append stored UTMs to the URL if missing
    const handleRouteChange = (url) => {
      const stored = sessionStorage.getItem("utm_params");
      if (!stored) return;

      const storedUtms = JSON.parse(stored);
      const [path, queryString = ""] = url.split("?");
      const currentParams = new URLSearchParams(queryString);

      let needsUpdate = false;
      Object.entries(storedUtms).forEach(([key, value]) => {
        if (!currentParams.has(key)) {
          currentParams.set(key, value);
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        const newUrl = `${path}?${currentParams.toString()}`;
        // Replace URL without triggering another navigation
        window.history.replaceState(null, "", newUrl);
      }
    };

    // Run on initial mount + every route change
    handleRouteChange(router.asPath);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  // ============================

  return (
    <ErrorBoundary>
      {isMobile && (
        <div style={{ marginTop: isHomePage ? "auto" : "8vh", marginBottom: "4vh", overflow: "visible" }}>
          <Component {...pageProps} />
        </div>
      )}
      {!isMobile && <Component {...pageProps} />}

      <div className={styles.cta_visible}>
        <a href="tel:8698009900">
          <button className={`${styles.btnfloating} ${styles.phone}`}>
            <img
              loading="lazy"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/call_icon.png"
              alt="Inframantra Call Icon"
            />
            <span>(+91) 86 9800 9900</span>
          </button>
        </a>

        <a href="https://api.whatsapp.com/send?phone=8698009900" target="_blank" rel="noreferrer">
          <button className={`${styles.btnfloating} ${styles.whatsapp}`}>
            <img
              loading="lazy"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/whats_app.png"
              alt="Inframantra WhatsApp Icon"
            />
            <span>(+91) 86 9800 9900</span>
          </button>
        </a>
      </div>

      <div className={styles.bottom_cta}>
        <div className={styles.left}>
          <a href="https://api.whatsapp.com/send?phone=8698009900" target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
            <img src="/logos/whatsapp.svg" alt="WhatsApp" />WhatsApp
          </a>
        </div>
        <div className={styles.right}>
          <a href="tel:8698009900" className={styles.contact}>
            <img src="/logos/phone.svg" alt="Contact Us" />Contact Us
          </a>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default MyApp;