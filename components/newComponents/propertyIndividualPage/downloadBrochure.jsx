import React from 'react';



function BrochureDownload({onClick}) {
  return (
    <section className="white-box brochure-download-section" id="brochure">

      <button
        className="btn  npPdfLink open-common-lead-form"
         onClick={onClick} type="button"
      >
        Download Brochure
      </button>
    </section>
  );
}

export default BrochureDownload;
