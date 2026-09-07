import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import styles from "./BottomCta.module.css";
import CustomBackdrop from "./Backdrop.jsx";

/*
  Mobile bottom action bar.

  One primary action, two icon buttons — rather than three equal-width blocks in
  three different colours, where nothing indicated which one mattered. WhatsApp
  and Call are recognisable from their icons alone and don't need to spend width
  on a label; Enquire does, and gets the room they give up.

  The enquiry form is the same one the property and blog cards open, loaded only
  when the button is pressed so it costs nothing until then.
*/
const PropertyPageFloatingContact = dynamic(
  () => import("../property-detail/PropertyPageFloatingContact.jsx"),
  { ssr: false }
);

const PHONE = "+918698009900";
const WHATSAPP_URL = "https://wa.me/918698009900";

export default function BottomCta({ name = "Form Submitted from Bottom Bar" }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  /*
    Rendered only once the width is actually known. useMediaQuery starts false on
    the server and on the first client render, so keying off it directly would
    paint the bar on desktop for a frame before the effect corrected it.
  */
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      <div className={styles.bar} role="group" aria-label="Contact Inframantra">
        <a
          className={`${styles.iconBtn} ${styles.whatsapp}`}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
          </svg>
        </a>

        <a className={`${styles.iconBtn} ${styles.call}`} href={`tel:${PHONE}`} aria-label="Call us">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>

        <button type="button" className={styles.primary} onClick={() => setEnquiryOpen(true)}>
          Enquire Now
        </button>
      </div>

      {/* Portalled so the fixed backdrop escapes any transformed ancestor. */}
      {enquiryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <CustomBackdrop open onClose={() => setEnquiryOpen(false)}>
            <PropertyPageFloatingContact name={name} onClose={() => setEnquiryOpen(false)} />
          </CustomBackdrop>,
          document.body
        )}
    </>
  );
}
