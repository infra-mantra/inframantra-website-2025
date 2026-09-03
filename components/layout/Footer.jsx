import React, { useState, useRef, useEffect } from "react";
import { SocialIcon } from "react-social-icons";
import { MdLocationOn, MdEmail, MdArrowDropDown } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import styles from "./Footer.module.css";

// Quick Search — premium-pick projects per city, hardcoded (no API call).
// Order: Gurgaon, Mohali, Noida, Pune. Each item is [name, slug].
const QUICK_SEARCH = [
  {
    city: "Gurgaon",
    items: [
      ["Whiteland The Westin Residences", "whiteland-the-westin-residences-sector-103-gurugram"],
      ["Godrej Samaris", "godrej-samaris-sector-53-gurgaon"],
      ["Tulip Monsella", "tulip-monsella-sector-53-gurgaon"],
      ["Tulip Melrose", "tulip-melrose-sector-70-gurgaon"],
      ["Tulip Crimson", "tulip-crimson-sector-70-gurgaon"],
      ["Godrej Sora", "godrej-sora-sector-53-gurgaon"],
      ["BPTP Downtown 66", "bptp-downtown-66-sector-66-gurgaon"],
      ["Satya Levante Residences", "satya-levante-residences-sector-104-gurgaon"],
      ["Whiteland The Aspen", "whiteland-the-aspen-sector-76-gurgaon"],
      ["Vatika Seven Elements", "vatika-seven-elements-sector-89a-gurgaon"],
      ["Vatika Sovereign Park", "vatika-sovereign-park-sector-99-gurgaon"],
      ["Ambience Creacions", "ambience-creacions-sector-22-gurugram"],
      ["Saan Verdante", "saan-verdante-sector-95-gurgaon"],
      ["Tulip Violet", "tulip-violet-sector-69-gurgaon"],
      ["Experion The Trillion", "experion-the-trillion-sector-48-gurgaon"],
      ["Shapoorji Pallonji The Dualis", "shapoorji-pallonji-the-daulis-sector-46-gurgaon"],
      ["Hero Homes The Palatial", "hero-homes-the-palatial-sector-104-gurgaon"],
      ["Birla Pravaah", "birla-pravaah-sector-71-gurgaon"],
      [
        "Signature Global Tonino Lamborghini Residences",
        "signature-global-tonino-lamborghini-residencies-sector-71-gurgaon",
      ],
      ["Birla Arika", "birla-arika-sector-31-gurgaon"],
      ["Trevoc Royal Residences", "trevoc-royal-residences-sector-56-gurgaon"],
      ["Max Estates The Terraces", "max-estates-the-terraces-sector-36a-gurgaon"],
      ["TARC Ishva", "tarc-ishva-sector-63a-gurgaon"],
      ["Puri Diplomatic Residences", "puri-diplomatic-residences-sector-111-gurgaon"],
      ["Godrej Miraya", "godrej-miraya-sector-43-gurgaon"],
      ["Krisumi Waterside Residences", "krisumi-waterside-residences-sector-36A-gurgaon"],
      ["BPTP GAIA Residences", "bptp-gaia-residences-sector-102-gurugram"],
      ["Signature Global Daxin Vistas", "signature-global-daxin-vistas-sohna-south-gurgaon"],
      ["Signature Global Cloverdale", "signature-global-cloverdale-sector-71-gurgaon"],
      ["Signature Global Sarvam DXP", "signature-global-deluxe-dxp-sector-37d-gurgaon"],
    ],
  },
  {
    city: "Mohali",
    items: [
      ["Noble Callista", "noble-callista-sector-66b-mohali"],
      ["Gillco Meraqui", "gillco-meraqui-sector-126-mohali"],
      ["Noble Aurellia", "noble-aurellia-sector-88-mohali"],
      ["Homeland Regalia", "homeland-regalia-sector-77-mohali"],
    ],
  },
  {
    city: "Noida",
    items: [
      ["TATA Eureka Park", "tata-eureka-park-sector-150-noida"],
      ["M3M The Cullinan", "m3m-the-cullinan-sector-94-noida"],
      ["Kalpataru Vista", "kalpataru-vista-sector-128-noida"],
      ["Prateek Canary", "prateek-canary-sector-150-noida"],
      ["Experion Elements", "experion-elements-sector-45-noida"],
      ["ACE HAN'EI", "ace-hanei-sector-12-noida"],
      ["Godrej Woods", "godrej-woods-sector-43-noida"],
      ["Amrapali Silicon City", "amrapali-silicon-city-sector-76-noida"],
    ],
  },
  {
    city: "Pune",
    items: [
      ["Pristine O2 World", "pristine-o2-world-kharadi-pune"],
      ["Gera Island of Joy", "gera-island-of-joy-kharadi-pune"],
      ["Kolte Patil Life Republic 24k Espada", "kolte-patil-24k-espada-hinjewadi-pune"],
      ["Majestique Evolvus", "majestique-evolvus-kharadi-pune"],
      ["Lodha Panache", "lodha-panache-hinjewadi-pune"],
      ["Lodha Estilo", "lodha-estilo-kharadi-pune"],
      ["Majestique Towers", "majestique-towers-kharadi-pune-east"],
      ["Gera Winds of Joy", "gera-winds-of-joy-hinjewadi-pune"],
      ["Saheel Itrend Futura", "saheel-itrend-futura-mahalunge-pune-west"],
      ["Godrej the Gale", "godrej-the-gale-hinjewadi-pune-west"],
      ["Mantra Mirari", "mantra-mirari-mundhwa-pune"],
      ["Lodha Bella Vita", "lodha-bella-vita-nibm-road-pune"],
      ["Mantra Magnus", "mantra-magnus-mundhwa-pune"],
      ["Kolte Patil Springshire", "kolte-patil-springshire-wagholi-pune"],
      ["Mantra Melange", "mantra-melange-kharadi-pune"],
      ["Mahindra IvyLush", "mahindra-ivylush-kharadi-pune"],
    ],
  },
  {
    city: "Jaipur",
    items: [
      ["Vatika Jaipur 21", "vatika-jaipur-21-vatika-infotech-city-jaipur-rajasthan"],
      ["Vatika City Front Villa", "vatika-city-front-villa-vatika-infotech-city-jaipur"],
    ],
  },
];

function Footer() {
  const [openDropDown, setOpenDropdown] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [loading, setLoading] = useState(false);
  const footerRef = useRef(null);

  const checkScreenWidth = () => setIsDesktop(window.innerWidth >= 769);

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  useEffect(() => {
    const updateFooterPosition = () => {
      if (!footerRef.current) return;
      const footerTop = footerRef.current.getBoundingClientRect().top + window.scrollY;
      const footerHeight = footerRef.current.offsetHeight;
      window.dispatchEvent(
        new CustomEvent("footerPosition", { detail: { footerTop, footerHeight } })
      );
    };
    updateFooterPosition();
    window.addEventListener("resize", updateFooterPosition);
    return () => window.removeEventListener("resize", updateFooterPosition);
  }, []);

  const handleFooterDropdownClick = (key) => {
    const isOpening = openDropDown !== key;
    if (isOpening) {
      setLoading(true);
      setOpenDropdown(key);
      setTimeout(() => setLoading(false), 500);
    } else {
      setOpenDropdown(null);
    }
  };

  const companyColumn = (
    <div className={styles.footerSecondSectionCompanyDetailsWrapper}>
      <h4>INFRAMANTRA</h4>
      <p>
        <Link legacyBehavior href="/">
          Home
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/about-us">
          About Us
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/our-services">
          Services
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/calculators">
          Calculators
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/testimonials">
          Testimonials
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/careers">
          Careers
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/blog">
          Media And Blogs
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/developer">
          Developers
        </Link>
      </p>
      <p>
        <Link legacyBehavior href="/contact-us">
          Contact Us
        </Link>
      </p>
    </div>
  );

  const quickSearchColumn = (
    <div className={styles.footerThirdSectionCompanyDetailsWrapper}>
      <h4>Quick Search</h4>
      {QUICK_SEARCH.map(({ city, items }) => (
        <div className={styles.footerThirdSectionDropdownFlex} key={city}>
          <div className={styles.footerThirdSectionDropdownHeaderFlex}>
            <p onClick={() => handleFooterDropdownClick(city)}>Top Properties In {city}</p>
            <MdArrowDropDown onClick={() => handleFooterDropdownClick(city)} />
          </div>
          {loading && openDropDown === city && <div className={styles.spinner}></div>}
          {openDropDown === city && (
            <div className={styles.footerThirdSectionDropdownLinkWrapper}>
              {items.map(([name, slug]) => (
                <p key={slug}>
                  <Link legacyBehavior href={`/property/${slug}`}>
                    {name}
                  </Link>
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.footerWrapper} id="footer" ref={footerRef}>
      <div className={styles.footerFirstSectionContainer}>
        <div className={styles.footerFirstSectionCompanyDetailsWrapper}>
          <img
            src="/logos/logo-white.webp"
            alt="Infra logo white"
            width={260}
            height={52}
            loading="lazy"
          />
          <p className={styles.footerTagline}>
            Redefining real estate with trust, transparency &amp; a curated portfolio of premium
            homes.
          </p>
          <div className={styles.footerFirstSectionCompanyDetailsFlex}>
            <MdLocationOn style={{ color: "#E7B554", fontSize: "25px", marginRight: "10px" }} />
            <p>95, Institutional Area, Sector 32, Gurugram</p>
          </div>
          <div className={styles.footerFirstSectionCompanyDetailsFlex}>
            <FaPhoneAlt style={{ color: "#E7B554", fontSize: "20px", marginRight: "10px" }} />
            <p>+91 86 9800 9900</p>
          </div>
          <div className={styles.footerFirstSectionCompanyDetailsFlex}>
            <MdEmail style={{ color: "#E7B554", fontSize: "20px", marginRight: "10px" }} />
            <p>marketing@inframantra.com </p>
          </div>
        </div>

        {isDesktop ? (
          <>
            {companyColumn}
            {quickSearchColumn}
          </>
        ) : (
          <div className={styles.footerSecondSectionMobileContainer}>
            {companyColumn}
            {quickSearchColumn}
          </div>
        )}

        <div className={styles.footerForthSectionCompanyDetailsWrapper}>
          <h4>Follow Us</h4>
          {isDesktop ? (
            <>
              <div className={styles.footerForthSectionIconWrapper}>
                <SocialIcon
                  url="https://www.facebook.com/inframantraofficial"
                  style={{ height: "40px", width: "40px" }}
                />
                <SocialIcon
                  url="https://www.instagram.com/inframantraofficial/"
                  style={{ height: "40px", width: "40px" }}
                />
              </div>
              <div className={styles.footerForthSectionIconWrapper}>
                <SocialIcon
                  url="https://www.youtube.com/@inframantraofficial"
                  style={{ height: "40px", width: "40px" }}
                />
                <SocialIcon
                  url="https://in.linkedin.com/company/inframantra"
                  style={{ height: "40px", width: "40px" }}
                />
              </div>
            </>
          ) : (
            <div className={styles.footerForthSectionIconWrapper}>
              <SocialIcon
                url="https://www.facebook.com/inframantraofficial"
                style={{ height: "40px", width: "40px" }}
              />
              <SocialIcon
                url="https://www.instagram.com/inframantraofficial/"
                style={{ height: "40px", width: "40px" }}
              />
              <SocialIcon
                url="https://www.youtube.com/@inframantraofficial"
                style={{ height: "40px", width: "40px" }}
              />
              <SocialIcon
                url="https://in.linkedin.com/company/inframantra"
                style={{ height: "40px", width: "40px" }}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footerSecondSectionContainer}>
        <div className={styles.footerSecondSectionLinksFlex}>
          <p>
            <Link legacyBehavior href="/page/terms-conditions">
              Terms And Conditions
            </Link>
          </p>
          <p>
            <Link legacyBehavior href="/page/privacy-policy">
              Privacy Policy
            </Link>
          </p>
          <p>
            <Link legacyBehavior href="/page/user-agreement">
              User Agreement
            </Link>
          </p>
          <p>
            <Link legacyBehavior href="/page/disclaimer">
              Disclaimer
            </Link>
          </p>
          <p>
            <Link legacyBehavior href="/sitemap">
              Sitemap
            </Link>
          </p>
        </div>
        <div className={styles.footerSecondSectionCopyRightFlex}>
          <p>Copyright @ {new Date().getFullYear()} Inframantra</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
