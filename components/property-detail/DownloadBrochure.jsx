import React from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `bd` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means bd["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import bd from "./DownloadBrochure.module.css";

function BrochureDownload({ onClick }) {
  return (
    <section className={`white-box ${bd["brochure-download-section"]}`} id="brochure">
      <button className="btn  npPdfLink open-common-lead-form" onClick={onClick} type="button">
        Download Brochure
      </button>
    </section>
  );
}

export default BrochureDownload;
