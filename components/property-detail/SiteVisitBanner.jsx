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
          <h3>Want to Explore the Locality More Closely ? </h3>
          <h2>Schedule a Site Visit with Experts Now!</h2>
          <div className={sv["cta-btn-w"]}>
            <div className={`highlight-wrappers ${sv["cta-w"]}`}>
              <button
                style={{ background: "#e7b554", color: "#fff" }}
                className="card-bg card card-ct-wt animation font-size"
                onClick={handleform}
              >
                Schedule a Site Visit
              </button>
            </div>
          </div>
        </div>

        <div className={sv["site-visit-right"]}>
          <img src="/propertyIndividualPage/cropImag2.png" alt="Expert" />
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
