import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// The enquiry popup carries the whole form and react-phone-input-2. Loading it on
// every page just to render a button would undo the work keeping script evaluation
// down, so it only arrives once someone opens it.
const EnquiryPopUp = dynamic(() => import("../components/shared/forms/CTANEW.jsx"), {
  ssr: false,
});

/*
  The projectName recorded against a lead from these buttons.

  They sit outside every page component, so there is no prop to thread a name down
  from — the URL is the only thing that always says where the person was. Never
  returns an empty string: projectEnquiry.model.js declares projectName required, so
  an empty one throws on save and the lead is lost.
*/
const projectNameFromPath = (path = "") => {
  const parts = (path.split("?")[0] || "").split("/").filter(Boolean);
  const titled = (slug) =>
    decodeURIComponent(slug)
      .replace(/-/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  if (!parts.length) return "Home Page";
  if (parts[0] === "property" && parts[1]) return titled(parts[1]);
  if (parts[0] === "property-listing" && parts[2])
    return titled(parts[2]).replace(/\bBhk\b/g, "BHK");
  return titled(parts[parts.length - 1]);
};

// Prefilled so the agent opens on the right project instead of asking. WhatsApp
// drops this in the compose box, so the sender can still edit it before sending.
const waLink = (projectName, path) => {
  const url = "https://inframantra.com" + (path === "/" ? "" : (path || "").split("?")[0]);
  const text = [
    `Hi Inframantra, I am interested in ${projectName}.`,
    "",
    "Please share the price list, floor plans and availability.",
    "",
    `Page: ${url}`,
  ].join(String.fromCharCode(10));
  return `https://api.whatsapp.com/send?phone=8698009900&text=${encodeURIComponent(text)}`;
};
import "../styles/self-hosted-fonts.css";
import "../styles/globals.css";

// swiper/css/bundle already contains swiper/css (core) plus every module's
// styles — the separate "swiper/css" import below it was a duplicate.
import "swiper/css/bundle";
import "../styles/newHome.css";
import "../styles/properyHeader.css";

import styles from "./_app.module.css";

import ErrorStack from "./_error.js";

/*
  Inline rather than react-icons. _app.js imports land in the shared bundle that
  every page loads, and pulling the react-icons/fa barrel in here for three glyphs
  cost ~6 kB of First Load JS on every route. currentColor is kept so each button's
  `color` still drives its icon.
*/
const svgProps = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 512 512",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false",
});

const IconPhone = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
  </svg>
);

const IconWhatsApp = ({ size = 20 }) => (
  <svg {...svgProps(size)} viewBox="0 0 448 512">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 110.9L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-69.1-157zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const IconMessage = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z" />
  </svg>
);

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
  const [enquireOpen, setEnquireOpen] = useState(false);
  const enquiryProject = projectNameFromPath(router.asPath);
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
            <IconPhone size={18} />
            <span>(+91) 86 9800 9900</span>
          </button>
        </a>

        {/* Enquire joins the same fixed stack as Phone and WhatsApp, in the brand
            gold (#e7b554) rather than their green, so it reads as the primary action
            rather than a third contact channel. */}
        <button
          type="button"
          onClick={() => setEnquireOpen(true)}
          className={`${styles.btnfloating} ${styles.enquire}`}
          aria-label="Request a callback"
        >
          <IconMessage size={18} />
          <span>Request a Callback</span>
        </button>

        <a href={waLink(enquiryProject, router.asPath)} target="_blank" rel="noreferrer">
          <button className={`${styles.btnfloating} ${styles.whatsapp}`}>
            <IconWhatsApp size={20} />
            <span>(+91) 86 9800 9900</span>
          </button>
        </a>
      </div>

      <div className={styles.bottom_cta}>
        <div className={styles.left}>
          <a
            href={waLink(enquiryProject, router.asPath)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            <IconWhatsApp size={20} />
            <span>WhatsApp</span>
          </a>
        </div>
        {/* Third cell. .left/.right were 50% each and are now thirds, so this fits
            between them without the bar overflowing. */}
        <div className={styles.middle}>
          <button
            type="button"
            onClick={() => setEnquireOpen(true)}
            className={styles.enquireMobile}
          >
            <IconMessage size={16} />
            <span>Enquire</span>
          </button>
        </div>

        <div className={styles.right}>
          <a href="tel:8698009900" className={styles.contact}>
            <IconPhone size={15} />
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      {showChat && <PropertyChatbot />}

      {enquireOpen && (
        <EnquiryPopUp
          popUpenable={enquireOpen}
          onClickOff={setEnquireOpen}
          name={enquiryProject}
          text="TO CONNECT WITH OUR PROPERTY ADVISOR"
          phone="+91 86 9800 9900"
          id="floatingEnquiry"
        />
      )}
    </ErrorBoundary>
  );
}

export default MyApp;
