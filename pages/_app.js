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
import "../styles/featureProperties.css"
import styles from '../styles/_app.module.css'


import "../styles/pageHeader.module.css";


import ErrorStack from "./_error.js"; // 👈 Import your error animation

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
  console.log(styles)
  // Check if the current route is not the home page
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
  }
  , []);

  return (
    <ErrorBoundary>
      {isMobile && (<div style={{ marginTop: isHomePage ? "auto" : "8vh" ,marginBottom:"4vh"}}>
        <Component {...pageProps} />
      </div>)}
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