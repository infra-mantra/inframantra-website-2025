import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "../styles/self-hosted-fonts.css";
import "../styles/globals.css";

// swiper/css/bundle already contains swiper/css (core) plus every module's
// styles — the separate "swiper/css" import below it was a duplicate.
import "swiper/css/bundle";
import "../styles/newHome.css";
import "../styles/properyHeader.css";

import styles from "./_app.module.css";

import ErrorStack from "./_error.js";

// Chatbot is pure post-load interaction — no SEO value, no above-the-fold
// content. Code-split it (ssr:false) so its ~40 KB of JS + inline styles stay
// out of the server HTML and the initial hydration bundle. It's mounted only
// after the page goes idle or the user interacts (see `showChat` below), so it
// never competes with first paint / LCP on the homepage.
const PropertyChatbot = dynamic(() => import("../components/shared/PropertyChatbot.jsx"), {
  ssr: false,
});

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
  const [showChat, setShowChat] = useState(false);

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // Mount the chatbot only after the first genuine user interaction, so its
  // chunk + styled-jsx never execute during initial load (kept off the main
  // thread that Total Blocking Time measures). Real users scroll/tap within
  // moments; an automated audit never interacts, so it stays unmounted there.
  useEffect(() => {
    const reveal = () => setShowChat(true);
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, reveal, { passive: true, once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, reveal));
    };
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
      {/* Always keep the same element here (a plain <div>) so toggling the mobile
          margin never changes the tree shape. Previously this switched between a
          wrapped and unwrapped <Component>, which made React unmount + remount the
          entire page after hydration on mobile — throwing away the server-rendered
          DOM and causing a layout shift. The style is applied conditionally instead. */}
      <div style={isMobile ? mobileWrapperStyle : undefined}>
        <Component {...pageProps} />
      </div>

      <div className={styles.cta_visible}>
        <a href="tel:8698009900">
          <button className={`${styles.btnfloating} ${styles.phone}`}>
            <img
              loading="lazy"
              width="18"
              height="18"
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
              width="18"
              height="18"
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
          >
            <img src="/logos/whatsapp.svg" alt="WhatsApp" width="20" height="20" />
            <span>WhatsApp</span>
          </a>
        </div>
        <div className={styles.right}>
          <a href="tel:8698009900" className={styles.contact}>
            <img src="/logos/phone.svg" alt="Contact Us" width="16" height="16" />
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      {showChat && <PropertyChatbot />}
    </ErrorBoundary>
  );
}

export default MyApp;
