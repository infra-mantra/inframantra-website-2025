import React from 'react';

function Sitevisit() {
  return (
    <div className="site-visit-wrapper">
      <div className="site-visit-inner">
        
        <div className="site-visit-left">
          <h3>Want to Explore the locality more closely</h3>
          <h2>Schedule a site visit with Experts Now!</h2>
          <div className='cta-btn-w'>
        <div className="highlight-wrappers cta-w">
              <button
                style={{ background: '#e7b554',color:'#fff' }}
                className="card-bg card card-ct-wt animation font-size" 
              >
                Schedule a Site Visit
              </button>
            </div>

            </div>
        </div>

        <div className="site-visit-right">
          <img src="/propertyIndividualPage/cropImag2.png" alt="Expert" />
        </div>

      </div>
    </div>
  );
}

export default Sitevisit;
