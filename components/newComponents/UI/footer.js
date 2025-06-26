import React, { useState, useRef, useEffect } from 'react';

import { SocialIcon } from 'react-social-icons';

import { MdLocationOn, MdEmail, MdArrowDropDown   } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import Link from 'next/link';

function Footer() {
  const [openDropDown, setOpenDropdown] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [loading, setLoading] = useState(false);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
    setIsMobile(window.innerWidth <=769);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);
  const footerRef = useRef(null);
  useEffect(() => {
    const updateFooterPosition = () => {
      const footerTop = footerRef.current.getBoundingClientRect().top + window.scrollY;
      const footerHeight = footerRef.current.offsetHeight;
      window.dispatchEvent(new CustomEvent('footerPosition', {
        detail: { footerTop, footerHeight }
      }));
    };

    updateFooterPosition(); // Initial position
    window.addEventListener('resize', updateFooterPosition);

    return () => {
      window.removeEventListener('resize', updateFooterPosition);
    };
  }, []);
  const handleFooterDropdownClick = (index) => {
    const isOpening = openDropDown !== index;
  
    if (isOpening) {
      setLoading(true);
      setOpenDropdown(index);         // ← immediately mark it open
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      setOpenDropdown(null);
    }
  };
  return (
    <div className="footerWrapper" id="footer" ref={footerRef}>
      <div className="footerFirstSectionContainer">
        <div className="footerFirstSectionCompanyDetailsWrapper">
          <img
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogo.png"
            alt="Infra logo white"
          />
          <div className="footerFirstSectionCompanyDetailsFlex">
            <MdLocationOn style={{
                color: '#E7B554',
                fontSize: '25px',
                marginRight: '10px',
              }}/>
            <p>95, Institutional Area, Sector 32, Gurugram</p>
          </div>
          <div className="footerFirstSectionCompanyDetailsFlex">
            <FaPhoneAlt style={{
                color: '#E7B554',
                fontSize: '20px',
                marginRight: '10px',
              }}/>
            <p>+91 86 9800 9900 </p>
          </div>
          <div className="footerFirstSectionCompanyDetailsFlex">
            <MdEmail
              style={{
                color: '#E7B554',
                fontSize: '20px',
                marginRight: '10px',
              }}
            />
            <p>marketing@inframantra.com </p>
          </div>
        </div>
        {isDesktop && (
          <>
            <div className="footerSecondSectionCompanyDetailsWrapper">
              <h4>INFRAMANTRA</h4>
              <p><Link  legacyBehavior={true} href='/'>Home</Link></p>
              <p><Link  legacyBehavior={true} href='/about-us'>About Us</Link></p>
              <p><Link  legacyBehavior={true} href='/our-services'>Services</Link></p>
              <p><Link  legacyBehavior={true} href="/testimonials">Testimonials</Link></p>
              <p><Link  legacyBehavior={true} href='/careers'>Careers</Link></p>
              <p><Link  legacyBehavior={true} href='/blog'>Media And Blogs</Link></p>
              <p><Link  legacyBehavior={true} href='/developer'>Developers</Link></p>
              <p><Link  legacyBehavior={true} href='/contact-us'>Contact Us</Link></p>
            </div>
            <div className="footerThirdSectionCompanyDetailsWrapper">
              <h4>Quick Search</h4>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p   onClick={() => handleFooterDropdownClick(1)}>Top Properties In Gurgaon</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(1)}
                  />
                </div>
              {loading  && openDropDown ==1 &&  <div className="spinner"></div>}
                {openDropDown === 1 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                    <p><Link  legacyBehavior={true} href='/property/vatika-sovereign-park-sector-99-gurgaon'>Vatika Sovereign Park</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/vatika-seven-elements-sector-89a-gurgaon'>Vatika Seven Elements</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/tulip-crimson-sector-70-gurgaon'>Tulip Crimson</Link></p>
                    <p><Link  legacyBehavior={true} href="/property/tulip-monsella-sector-53-gurgaon">Tulip Monsella</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/4s-the-aurrum-sector-59-gurgaon'>4S The Aurrum</Link></p>  
                    <p><Link  legacyBehavior={true} href='/property/whiteland-the-aspen-sector-76-gurgaon'>Whiteland The Aspen</Link></p>  
                    <p><Link  legacyBehavior={true} href='/property/dlf-privana-south-sector-77-gurgaon'>Dlf Privana South</Link></p>
                    <p><Link  legacyBehavior={true} href='/tarc-ishva-sector-63a-gurgaon'>Tarc Ishva</Link></p>
                  </div>
                )}
              </div>

              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p   onClick={() => handleFooterDropdownClick(2)}>Top Properties In Pune</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(2)}
                  />
                </div>
                {loading  && openDropDown ==2 &&  <div className="spinner"></div>}
                {openDropDown === 2 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                      <p><Link  legacyBehavior={true} href='/property/pristine-o2-world-kharadi-pune'>Pristine O2 World</Link></p>
                      <p><Link  legacyBehavior={true} href='/property/lodha-estilo-kharadi-pune'>Lodha Estilo</Link></p>
                      <p><Link  legacyBehavior={true} href='/property/majestique-towers-kharadi-pune-east'>Majestique Towers</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/gera-winds-of-joy-hinjewadi-pune'>Gera Winds of Joy</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/gera-island-of-joy-kharadi-pune'>Gera Island of Joy</Link></p>
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(3)}>Top Properties In Noida</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(3)}
                  />
                </div>
                {loading  && openDropDown ==3 &&  <div className="spinner"></div>}
                {openDropDown === 3 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                    <p><Link  legacyBehavior={true} href='/property/experion-elements-sector-45-noida'>Experion Elements</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/ace-hanei-sector-12-noida'>ACE HAN'EI                    </Link></p>
                    <p><Link  legacyBehavior={true} href='/property/godrej-woods-sector-43-noida'>Godrej Woods
                    </Link></p>
                    <p><Link  legacyBehavior={true} href='/property/m3m-the-cullinan-sector-94-noida'>M3M The Cullinan
                    </Link></p>
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(4)}>Premium Properties</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(4)}
                  />
                </div>
                {loading  && openDropDown ==4 &&  <div className="spinner"></div>}
                {openDropDown === 4 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                    <p><Link  legacyBehavior={true} href='/property/signature-global-cloverdale-sector-71-gurgaon'>Signature Global Cloverdale</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/dlf-privana-north-sector-76-gurgaon'>Dlf Privana North</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/experion-the-trillion-sector-48-gurgaon'>Experion The Trillion</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/shapoorji-pallonji-the-daulis-sector-46-gurgaon'>Shapoorji Pallonji The Dualis</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/bptp-amstoria-verti-greens-sector-102-gurgaon'>BPTP Amstoria Verti Greens</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/whiteland-the-aspen-sector-76-gurgaon'>Whiteland The Aspen</Link></p>
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p   onClick={() => handleFooterDropdownClick(5)}>Exclusive Properties</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(5)}
                  />
                </div>
                {loading  && openDropDown ==5 &&  <div className="spinner"></div>}
                {openDropDown === 5 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                    <p><Link  legacyBehavior={true} href='/property/vatika-seven-elements-sector-89a-gurgaon'>Vatika Seven Elements</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/4s-the-aurrum-sector-59-gurgaon'>4S The Aurrum</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/tulip-crimson-sector-70-gurgaon'>Tulip Crimson</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/tulip-monsella-sector-53-gurgaon'>Tulip Monsella</Link></p>

                  </div>  
                )}
              </div>
            </div>
          </>
        )}
        {!isDesktop && (
          <div className="footerSecondSectionMobileContainer">
            <div className="footerSecondSectionCompanyDetailsWrapper">
              <h4>INFRAMANTRA</h4>
              <p><Link  legacyBehavior={true} href='/'>Home</Link></p>
              <p><Link  legacyBehavior={true} href='/about-us'>About Us</Link></p>
              <p><Link  legacyBehavior={true} href='/our-services'>Services</Link></p>
              <p><Link  legacyBehavior={true} href="/testimonials">Testimonials</Link></p>
              <p><Link  legacyBehavior={true} href='/careers'>Careers</Link></p>
              <p><Link  legacyBehavior={true} href='/blog'>Media And Blogs</Link></p>
              <p><Link  legacyBehavior={true} href='/contact-us'>Contact Us</Link></p>
              <p><Link  legacyBehavior={true} href='/developer'>Developers</Link></p>
            </div>
            <div className="footerThirdSectionCompanyDetailsWrapper">
              <h4>Quick Search</h4>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(1)}>Top Properties In Gurgaon</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(1)}
                  />
                </div>
                {loading  && openDropDown ==1 &&  <div className="spinner"></div>}
                {openDropDown === 1 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                       <p><Link  legacyBehavior={true} href='/property/vatika-sovereign-park-sector-99-gurgaon'>Vatika Sovereign Park</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/vatika-seven-elements-sector-89a-gurgaon'>Vatika Seven Elements</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/tulip-crimson-sector-70-gurgaon'>Tulip Crimson</Link></p>
                    <p><Link  legacyBehavior={true} href="/property/tulip-monsella-sector-53-gurgaon">Tulip Monsella</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/4s-the-aurrum-sector-59-gurgaon'>4S The Aurrum</Link></p>  
                    <p><Link  legacyBehavior={true} href='/property/whiteland-the-aspen-sector-76-gurgaon'>Whiteland The Aspen</Link></p>  
                    <p><Link  legacyBehavior={true} href='/property/dlf-privana-south-sector-77-gurgaon'>Dlf Privana South</Link></p>
                    <p><Link  legacyBehavior={true} href='/tarc-ishva-sector-63a-gurgaon'>Tarc Ishva</Link></p>
                  </div>
                )}
              </div>

              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(2)}>Top Properties In Pune</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(2)}
                  />
                </div>
                {loading  && openDropDown ==2 &&  <div className="spinner"></div>}
                {openDropDown === 2 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                     <p><Link  legacyBehavior={true} href='/property/pristine-o2-world-kharadi-pune'>Pristine O2 World</Link></p>
                      <p><Link  legacyBehavior={true} href='/property/lodha-estilo-kharadi-pune'>Lodha Estilo</Link></p>
                      <p><Link  legacyBehavior={true} href='/property/majestique-towers-kharadi-pune-east'>Majestique Towers</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/gera-winds-of-joy-hinjewadi-pune'>Gera Winds of Joy</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/gera-island-of-joy-kharadi-pune'>Gera Island of Joy</Link></p>
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(3)}>Top Properties In Noida</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(3)}
                  />
                </div>
                {loading  && openDropDown ==3 &&  <div className="spinner"></div>}
                {openDropDown === 3 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                     <p><Link  legacyBehavior={true} href='/property/experion-elements-sector-45-noida'>Experion Elements</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/ace-hanei-sector-12-noida'>ACE HAN'EI                    </Link></p>
                    <p><Link  legacyBehavior={true} href='/property/godrej-woods-sector-43-noida'>Godrej Woods
                    </Link></p>
                    <p><Link  legacyBehavior={true} href='/property/m3m-the-cullinan-sector-94-noida'>M3M The Cullinan
                    </Link></p>
                    {/* <p>4S The Aurrum</p> */}
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(4)}>Premium Properties</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(4)}
                  />
                </div>
                {loading  && openDropDown ==4 &&  <div className="spinner"></div>}
                {openDropDown === 4 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                     <p><Link  legacyBehavior={true} href='/property/signature-global-cloverdale-sector-71-gurgaon'>Signature Global Cloverdale</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/dlf-privana-north-sector-76-gurgaon'>Dlf Privana North</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/experion-the-trillion-sector-48-gurgaon'>Experion The Trillion</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/shapoorji-pallonji-the-daulis-sector-46-gurgaon'>Shapoorji Pallonji The Dualis</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/bptp-amstoria-verti-greens-sector-102-gurgaon'>BPTP Amstoria Verti Greens</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/whiteland-the-aspen-sector-76-gurgaon'>Whiteland The Aspen</Link></p>
                  </div>
                )}
              </div>
              <div className="footerThirdSectionDropdownFlex">
                <div className="footerThirdSectionDropdownHeaderFlex">
                  <p  onClick={() => handleFooterDropdownClick(5)}>Exclusive Properties</p>
                  <MdArrowDropDown
                    onClick={() => handleFooterDropdownClick(5)}
                  />
                </div>
                {loading  && openDropDown ==5 &&  <div className="spinner"></div>}
                {openDropDown === 5 && (
                  <div className="footerThirdSectionDropdownLinkWrapper">
                    <p><Link  legacyBehavior={true} href='/property/vatika-seven-elements-sector-89a-gurgaon'>Vatika Seven Elements</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/4s-the-aurrum-sector-59-gurgaon'>4S The Aurrum</Link></p>
                    <p><Link  legacyBehavior={true} href='/property/tulip-crimson-sector-70-gurgaon'>Tulip Crimson</Link></p>
                     <p><Link  legacyBehavior={true} href='/property/tulip-monsella-sector-53-gurgaon'>Tulip Monsella</Link></p>

                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="footerForthSectionCompanyDetailsWrapper">
          <h4>Follow Us</h4>
          {isDesktop && (
            <>
              <div className="footerForthSectionIconWrapper">
                <SocialIcon url="https://www.facebook.com/inframantraofficial" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://x.com/INFRAMANTRA_" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://www.instagram.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
              </div>
              <div className="footerForthSectionIconWrapper">
                <SocialIcon url="https://www.youtube.com/@inframantraofficial" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://in.linkedin.com/company/inframantra" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://in.pinterest.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
              </div>
            </>
          )}
          {!isDesktop && (
            <div className="footerForthSectionIconWrapper">
              <SocialIcon url="https://www.facebook.com/inframantraofficial" style={{ height: '40px', width: '40px' }} />
              <SocialIcon url="https://x.com/INFRAMANTRA_" style={{ height: '40px', width: '40px' , backdropFilter: "#FFF"}} />
              <SocialIcon url="https://www.instagram.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
              <SocialIcon url="https://www.youtube.com/@inframantraofficial" style={{ height: '40px', width: '40px' }} />
              <SocialIcon url="https://in.linkedin.com/company/inframantra" style={{ height: '40px', width: '40px' }} />
              <SocialIcon url="https://in.pinterest.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
            </div>
          )}
        </div>
      </div>
      <div className="footerSecondSectionContainer">
        {isDesktop && (
          <>
            <div className="footerSecondSectionLinksFlex">
              <p><Link  legacyBehavior={true} href='/page/terms-conditions'>Terms And Conditions</Link></p>
              <p><Link  legacyBehavior={true} href='/page/privacy-policy'>Privacy Policy</Link></p>
              <p><Link  legacyBehavior={true} href='/page/user-agreement'>User Agreement</Link></p>
              <p><Link  legacyBehavior={true} href='/page/disclaimer'>Disclaimer</Link></p>
            </div>
            <div className="footerSecondSectionCopyRightFlex">
              <p>Copyright @ 2025 Inframantra</p>
              <p>All Rights Reserved</p>
            </div>
          </>
        )}
        {!isDesktop && (
          <>
            <div className="footerSecondSectionLinksFlex">
              <p><Link  legacyBehavior={true} href='/page/terms-conditions'>Terms And Conditions</Link></p>
              <p><Link  legacyBehavior={true} href='/page/privacy-policy'>Privacy Policy</Link></p>
              <p><Link  legacyBehavior={true} href='/page/user-agreement'>User Agreement</Link></p>
              <p><Link  legacyBehavior={true} href='/page/disclaimer'>Disclaimer</Link></p>
            </div>
            <div className="footerSecondSectionCopyRightFlex">
              <p>Copyright @ 2025 Inframantra</p>
              <p>All Rights Reserved</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Footer;
