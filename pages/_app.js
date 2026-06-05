import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import "../styles/responsive.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/bundle";
import "swiper/css";
import "../styles/newHome.css";
import "../styles/filter.css";
import "../styles/dropDownMenu.css";
import "../styles/PropertyHeaderImageGallery.css";
import "../styles/properyHeader.css";
import "../styles/propertyCard.css";
import "../styles/RightSlideModal.css";
import "../styles/config.css";
import "../styles/fullview.css";
import "../styles/brochureDownload.css";
import "../styles/site-visite.css";
import "../styles/developer.css";

import styles from "../styles/_app.module.css";
import "../styles/navbarsticky.css";
import "../styles/amenities.css";
import "../styles/landmark.css";

import "../styles/pageHeader.module.css";
import "../styles/map.css";

import ErrorStack from "./_error.js";
import PropertyChatbot from "../components/UI/PropertyChatbot.jsx";

// =====================================================
// UTM UTILITIES
// =====================================================
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
export const STORAGE_KEY = "utm_params";

export function detectRegionFromCampaign(campaign) {
  if (!campaign || typeof campaign !== "string") return null;
  const upper = campaign.toUpperCase();
  if (upper.indexOf("NRI_USA") !== -1 || upper.indexOf("_USA_") !== -1) return "USA";
  if (upper.indexOf("NRI_IND") !== -1 || upper.indexOf("_IND_") !== -1) return "IND";
  return null;
}

export function safeGetStored() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

export function safeSetStored(obj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (err) {
    // ignore
  }
}

export function getUtmParams() {
  const stored = safeGetStored();
  return {
    utm_source: stored.utm_source || "",
    utm_medium: stored.utm_medium || "",
    utm_campaign: stored.utm_campaign || "",
    utm_term: stored.utm_term || "",
    utm_content: stored.utm_content || "",
    region: stored.region || "",
  };
}

export function clearUtmParams() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    // ignore
  }
}
// =====================================================

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
  const [isMobile, setIsMobile] = useState(false);

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // STEP 1: Capture UTMs on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = safeGetStored();
    const utmsFromUrl = {};

    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) utmsFromUrl[key] = value;
    });

    const explicitRegion = params.get("region");
    if (explicitRegion) {
      utmsFromUrl.region = explicitRegion.toUpperCase();
    } else if (utmsFromUrl.utm_campaign) {
      const region = detectRegionFromCampaign(utmsFromUrl.utm_campaign);
      if (region) utmsFromUrl.region = region;
    }

    if (Object.keys(utmsFromUrl).length > 0) {
      const merged = Object.assign({}, stored, utmsFromUrl);
      safeSetStored(merged);
      console.log("[UTM] Captured:", merged);
    }
  }, []);

  // STEP 2: Append stored UTMs to URL on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      const storedUtms = safeGetStored();
      if (!storedUtms || Object.keys(storedUtms).length === 0) return;

      const parts = url.split("?");
      const path = parts[0];
      const queryString = parts[1] || "";
      const currentParams = new URLSearchParams(queryString);

      let needsUpdate = false;
      Object.keys(storedUtms).forEach((key) => {
        const value = storedUtms[key];
        if (value && !currentParams.has(key)) {
          currentParams.set(key, value);
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        const newUrl = path + "?" + currentParams.toString();
        window.history.replaceState(null, "", newUrl);
      }
    };

    handleRouteChange(router.asPath);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const mobileWrapperStyle = {
    marginTop: isHomePage ? "auto" : "8vh",
    marginBottom: "4vh",
    overflow: "visible",
  };

  return (
    <ErrorBoundary>
      {isMobile ? (
        <div style={mobileWrapperStyle}>
          <Component {...pageProps} />
        </div>
      ) : (
        <Component {...pageProps} />
      )}

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
          <a
            href="https://api.whatsapp.com/send?phone=8698009900"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          />
            <img src="/logos/whatsapp.svg" alt="WhatsApp" />
            <span>WhatsApp</span>
          
        </div>
        <div className={styles.right}>
          <a href="tel:8698009900" className={styles.contact} />
           <img src="/logos/phone.svg" alt="Contact Us" />
            <span>Contact Us</span>
    
 

        </div>
      </div>

      <PropertyChatbot />
    </ErrorBoundary>
  );
}

export default MyApp;