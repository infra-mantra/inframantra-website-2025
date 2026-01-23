import React ,{useState}from 'react';
import PopUpForm from '../../detailSections/CTA_NEW';

function Sitevisit() {
     const [popForm, setPopForm] = useState(false);
       const onClickOff = (val) =>setPopForm(val)
       const handleform = () => setPopForm(true);
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
                onClick={handleform}
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
       <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="To download brochure"
        name={name}
        />
    </div>
  );
}

export default Sitevisit;
