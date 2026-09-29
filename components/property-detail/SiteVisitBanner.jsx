import React, { useState } from "react";
import PopUpForm from "../shared/forms/CTANEW.jsx";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `sv` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means sv["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import sv from "./SiteVisitBanner.module.css";

function Sitevisit({ name }) {
  const [popForm, setPopForm] = useState(false);
  const onClickOff = (val) => setPopForm(val);
  const handleform = () => setPopForm(true);
  return (
    <div className={sv["site-visit-wrapper"]}>
      <div className={sv["site-visit-inner"]}>
        <div className={sv["site-visit-left"]}>
          <h3 className={sv["sv-eyebrow"]}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                fill="currentColor"
              />
            </svg>
            Want to Explore the Locality More Closely?
          </h3>
          <h2>
            Schedule a <span className={sv["sv-accent"]}>Site Visit</span> with Experts Now!
          </h2>
          <div className={sv["sv-actions"]}>
            <div className={sv["cta-btn-w"]}>
              <div className={`highlight-wrappers ${sv["cta-w"]}`}>
                <button
                  className="card-bg card card-ct-wt animation font-size"
                  onClick={handleform}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Schedule a Site Visit
                </button>
              </div>
            </div>
            <a className={sv["sv-call"]} href="tel:+918698009900">
              <span className={sv["sv-call-icon"]} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path
                    d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>
                or call <strong>+91 86 9800 9900</strong>
              </span>
            </a>
          </div>
        </div>

        <div className={sv["site-visit-right"]}>
          <span className={sv["sv-halo"]} aria-hidden="true" />
          <img src="/propertyIndividualPage/cropImag2.png" alt="Inframantra property expert" />
        </div>
      </div>
      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="to book a site visit with Experts Now!"
        name={name}
        id="propertyIndividualSiteRes"
      />
    </div>
  );
}

export default Sitevisit;
