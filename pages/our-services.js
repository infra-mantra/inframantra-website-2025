
import React, { useEffect,useState } from 'react';
import Wrapper from '../components/UI/Wrapper';
import styles from '../styles/ourservice.module.css'

function ServicesPage() {
   const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
    setIsMobile(window.innerWidth <=768);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  

  return (
    <Wrapper
     title={'Our Services - Home loans, Interiors, Property Buying and Management'}
     description={'INFRAMANTRA is a Real Estate Firm that helps to Build Value on Commercial and Residential properties. We work with the top Builders in Gurgaon, Pune, and Noida. '}
     keywords={'Home Loans, Home Interiors, Property Buying, Property Management'}
    >
      <div className={styles.servicePageWrapper}>
      <h1 className={styles.servicePageHeader}>OUR SERVICES</h1>
      <hr className={styles.servicePageHeaderBorderBottom} />
      <div></div>
      {isDesktop ? (
        <div className={styles.servicePageFirstSalePointContainer} id="Site-Visits">
          <div className={styles.servicePageFirstPointImgWrapper}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/siteVisit.avif"
              alt="Inframantra Site Visit"
            />
            <div className={styles.servicePageFirstPointImgBgrd} />
          </div>
          <div className={styles.servicePageFirstPointDescriptionWrapper}>
            <div className={styles.servicePageFirstPointDescriptionHeaderFlex}>
              <img
                className={styles.servicePageFirstPointDescriptionHeaderIcon}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/siteVisits.svg"
                alt="siteVisit"
              />
              <h4>SITE VISIT</h4>
            </div>
            <div className={styles.servicePageFirstPointDescriptionContentWrapper}>
              <p>
                Explore your dream home with our property experts and understand
                every detail like surroundings, locality, and all the amenities
                of the project.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.servicePageFirstSalePointContainer} id="Site-Visits">
          <div className={styles.servicePageFirstPointDescriptionHeaderFlex}>
            <img
              className={styles.servicePageFirstPointDescriptionHeaderIcon}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/siteVisits.svg"
              alt="siteVisit"
            />
            <h4>SITE VISIT</h4>
          </div>
          <div className={styles.servicePageFirstPointImgWrapper}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/siteVisit.avif"
              alt="Inframantra Site Visit"
            />
            <div className={styles.servicePageFirstPointImgBgrd} />
          </div>
          <div className={styles.servicePageFirstPointDescriptionContentWrapper}>
            <p>
              Explore your dream home with our property experts and understand
              every detail like surroundings, locality and all the amenities of
              the project.
            </p>
          </div>
        </div>
      )}

      {isDesktop ? (
        <>
          <div className={styles.servicePageFirstSalePointContainer} id="Consultancy">
            <div className={`${styles.servicePageFirstPointDescriptionWrapper} ${styles.servicePageFirstPointDescriptionWrapperSecondSectionNew}`}>
              <div className={styles.servicePageFirstPointDescriptionHeaderFlex}>
                <img
                  className={styles.servicePageFirstPointDescriptionHeaderIcon}
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/consultancy.svg"
                  alt="siteVisit"
                />
                <h4>CONSULTANCY</h4>
              </div>
              <div className={styles.servicePageFirstPointDescriptionContentWrapper}>
                <p>
                  Get valuable insights and personalised advice from our real
                  estate consultants, who will help you out in exploring
                  the best options, and finalise your dream home.
                </p>
              </div>
            </div>
            <div className={`${styles.servicePageFirstPointImgWrapper} ${styles.servicePageFirstPointImgWrapperSecondSectionNew}`}>
              <img
                className={styles.servicePageFirstPointImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/consultancy.avif"
                alt="Inframantra Consultancy"
              />
              <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdSecondSectionNew}`} />
            </div>
          </div>
          <div className={styles.servicePageSecondSectionIconWrapper}>
            <div className={styles.servicePageSecondSectionIconFlexContainer}>
              <div className={styles.servicePageSecondSectionIconFlex}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Market%20analysis%20and%20insights.svg"
                  alt="Market Analysis And Insights"
                />
                <p
                > Market Analysis And Insights </p>
              </div>
              <div></div>
            </div>
            <div className={styles.servicePageSecondSectionIconFlexContainer}>
              <div></div>
              <div className={styles.servicePageSecondSectionIconFlex}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Assistance%20with%20legal%20and%20regulatory%20requirements.svg"
                  alt="Market Analysis And Insights"
                />
                <p> Assistance with Legal and Regulatory Requirements</p>
              </div>
            </div>
            <div className={styles.servicePageSecondSectionIconFlexContainer}>
              <div className={styles.servicePageSecondSectionIconFlex}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Investment%20optimization%20strategies.svg"
                  alt="Market Analysis And Insights"
                />
              <p> Investment Optimization Strategies</p>
              </div>
              <div></div>
            </div>
            <div className={styles.servicePageSecondSectionIconFlexContainer}>
              <div></div>
              <div className={styles.servicePageSecondSectionIconFlex}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Personalized%20real%20estate%20advice.svg"
                  alt="Market Analysis And Insights"
                />
                <p> Personalized Real Estate Advice </p>
              </div>
            </div>
            <div className={styles.servicePageSecondSectionIconFlexContainer}>
              <div className="servicePageSecondSectionIconFlex">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Customized%20solutions%20for%20buying,%20selling,%20or%20leasing%20properties.svg"
                  alt="Market Analysis And Insights"
                />
                <p>
                  Customized Solutions for Buying, Selling, or Leasing
                  Properties
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.servicePageFirstSalePointContainer} id="Consultancy">
          <div className={styles.servicePageFirstPointDescriptionHeaderFlex} >
            <img
              className={styles.servicePageFirstPointDescriptionHeaderIcon}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/consultancy.svg"
              alt="consultancy"
            />
            <h4>CONSULTANCY</h4>
          </div>
          <div className={styles.servicePageFirstPointImgWrapper}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/consultancy.avif"
              alt="Inframantra Consultancy"
            />
            <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdRight}`} />
          </div>
          <div className={styles.servicePageFirstPointDescriptionContentWrapper}>
            <p>
              Get valuable insights and personalised advice from our real estate
              consultants, who will help you out in exploring the best options,
              and finalise your dream home.
            </p>
          </div>
          <div className={styles.servicePageSecondPointIconsContainer}>
            <div className={styles.servicePageSecondPointIconsColumnFlexContainer}>
              <div className={`${styles.servicePageSecondPointIconFlex} ${styles.iconContentFlexStart}`}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Market%20analysis%20and%20insights.svg"
                  alt="Market Analysis And Insights"
                  className={styles.servicePageSecondPointIconStyles}
                />
                <p
                  style={{
                    marginLeft: isDesktop ? '15px' : '10px',
                    fontSize: isDesktop ? 'auto' : '13px',
                  }}
                >
                  Market Analysis And Insights
                </p>
              </div>
              <div className={`${styles.servicePageSecondPointIconFlex} ${styles.iconContentFlexEnd} `}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Assistance%20with%20legal%20and%20regulatory%20requirements.svg"
                  alt="Market Analysis And Insights"
                  className={styles.servicePageSecondPointIconStyles}
                  style={{ marginLeft: '30%' }}
                />
                <p
                  style={{
                    marginLeft: isDesktop ? '15px' : '10px',
                    fontSize: isDesktop ? 'auto' : '13px',
                  }}
                >
                  Assistance with Legal and Regulatory Requirements
                </p>
              </div>
              <div className="servicePageSecondPointIconFlex iconContentFlexStart">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Investment%20optimization%20strategies.svg"
                  alt="Market Analysis And Insights"
                  className={styles.servicePageSecondPointIconStyles}
                />
                <p
                  style={{
                    marginLeft: isDesktop ? '15px' : '10px',
                    fontSize: isDesktop ? 'auto' : '13px',
                  }}
                >
                  Investment Optimization Strategies
                </p>
              </div>
              <div className={`${styles.servicePageSecondPointIconFlex} ${styles.iconContentFlexEnd}`}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Personalized%20real%20estate%20advice.svg"
                  alt="Market Analysis And Insights"
                  className={styles.servicePageSecondPointIconStyles}
                />
                <p
                  style={{
                    marginLeft: isDesktop ? '15px' : '10px',
                    fontSize: isDesktop ? 'auto' : '13px',
                  }}
                >
                  Personalized Real Estate Advice
                </p>
              </div>
              <div className={`${styles.servicePageSecondPointIconFlex} ${styles.iconContentFlexStart}`}>
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Customized%20solutions%20for%20buying,%20selling,%20or%20leasing%20properties.svg"
                  alt="Market Analysis And Insights"
                  className={styles.servicePageSecondPointIconStyles}
                />
                <p
                  style={{
                    marginLeft: isDesktop ? '15px' : '10px',
                    fontSize: isDesktop ? 'auto' : '13px',
                    width: '70%',
                  }}
                >
                  Customized Solutions for Buying, Selling, or Leasing
                  Properties
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDesktop ? (
        <div className={styles.servicePageThirdSalePointContainer} id="Hand-Holding">
          <div className={styles.servicePageThirdSalePointDescriptionHeaderFlex}>
            <img
              className={styles.servicePageFirstPointDescriptionHeaderIcon}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/handHolding.svg"
              alt="hand holding"
            />
            <h2>Seamless Assistance</h2>
          </div>
          <p className={styles.servicePageThirdSalePointDescription}>
            From home assistance to key handover, we ensure a seamless and a
            hassle-free experience, letting you settle into your new home with
            ease.
          </p>
          <div className={styles.servicePageFirstSalePointContainer}>
            <div className={styles.servicePageFirstPointImgWrapper}>
              <img
                className={styles.servicePageFirstPointImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/paperWork.avif"
                alt="Inframantra Documentation"
              />
              <div className={styles.servicePageFirstPointImgBgrd} />
            </div>
            <div className={styles.servicePageThirdPointDescriptionWrapper}>
              <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
                <p className={styles.servicePageHandHoldingPointers}>01</p>
              </div>
              <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
                <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                  DOCUMENTATION
                </h4>
                <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                  Simplify your paperwork with our expert help, ensuring a
                  smooth, hassle-free transaction at every step, so that you can experience
                  efficiency and ease like never before.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.servicePageFirstSalePointContainer}>
            <div className={styles.servicePageFirstPointImgWrapper}>
              <img
                className={styles.servicePageFirstPointImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/developerCordination.avif"
                alt="Inframantra Developer coordination"
              />
              <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdRight}`} />
            </div>
            <div className={styles.servicePageThirdPointDescriptionWrapper}>
              <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
                <p className={styles.servicePageHandHoldingPointers}>02</p>
              </div>
              <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
                <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                  DEVELOPER COORDINATION
                </h4>
                <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                  Easily connect with developers through our premium services, timely updates and smooth communication throughout
                  your home-buying journey. We ensure a streamlined experience
                  from start to finish!
                </p>
              </div>
            </div>
          </div>
          <div className={styles.servicePageFirstSalePointContainer}>
            <div className={styles.servicePageFirstPointImgWrapper}>
              <img
                className={styles.servicePageFirstPointImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/homeAssisstance.avif"
                alt="aHome Loan"
              />
              <div className={styles.servicePageFirstPointImgBgrd} />
            </div>
            <div className={styles.servicePageThirdPointDescriptionWrapper}>
              <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
                <p className={styles.servicePageHandHoldingPointers}>03</p>
              </div>
              <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
                <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                  HOME LOAN ASSISTANCE
                </h4>
                <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                  We offer various home loan solutions from top loan providers that are tailored to your needs,
                  so that you can secure the best offers and
                  terms for your home loan.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.servicePageFirstSalePointContainer}>
            <div className={styles.servicePageFirstPointImgWrapper}>
              <img
                className={styles.servicePageFirstPointImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/keyHandOver.avif"
                alt="Key Hand Over"
              />
              <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdRight}`} />
            </div>
            <div className={styles.servicePageThirdPointDescriptionWrapper}>
              <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
                <p className={styles.servicePageHandHoldingPointers}>04</p>
              </div>
              <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
                <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                  KEY HANDOVER
                </h4>
                <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                  Experience a smooth key handover, where each and every detail
                  is managed to ensure a smooth and effortless move-in to your
                  dream home.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.servicePageFirstSalePointContainer}
          style={{ marginTop: '25px' }}
          id="Hand-Holding"
        >
          <div className={styles.servicePageFirstPointDescriptionHeaderFlex}>
            <img
              className={styles.servicePageFirstPointDescriptionHeaderIcon}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/handHolding.svg"
              alt="hand holding"
            />
            <h4>Seamless Assistance</h4>
          </div>
          <div className={styles.servicePageFirstPointDescriptionContentWrapper}>
            <p style={{ marginBottom: '35px' }}>
              From home assistance to key handover, we ensure a seamless and a
              hassle-free experience, letting you settle into your new home with
              ease.
            </p>
          </div>
          <div className={`${styles.servicePageFirstPointImgWrapper} ${styles.noBottomMargin}`}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/paperWork.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className={styles.servicePageFirstPointImgBgrd} />
          </div>
          <div className={styles.servicePageThirdPointDescriptionWrapper}>
            <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
              <p className={styles.servicePageHandHoldingPointers}>01</p>
            </div>
            <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
              <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                DOCUMENTATION
              </h4>
              <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                Simplify your paperwork with our expert help, ensuring a smooth,
                hassle-free transaction at every step, so that you can experience efficiency
                and ease like never before.
              </p>
            </div>
          </div>
          <div className={`${styles.servicePageFirstPointImgWrapper} ${styles.noBottomMargin}`}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/developerCordination.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdRight}`} />
          </div>
          <div className={styles.servicePageThirdPointDescriptionWrapper}>
            <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
              <p className={styles.servicePageHandHoldingPointers}>02</p>
            </div>
            <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
              <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                DEVELOPER COORDINATION
              </h4>
              <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                Easily connect with developers through our premium
                services, timely updates and smooth communication throughout
                your home-buying journey. We ensure a streamlined experience
                from start to finish!
              </p>
            </div>
          </div>
          <div className={`${styles.servicePageFirstPointImgWrapper} ${styles.noBottomMargin}`}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/homeAssisstance.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className={styles.servicePageFirstPointImgBgrd} />
          </div>
          <div className={styles.servicePageThirdPointDescriptionWrapper}>
            <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
              <p className={styles.servicePageHandHoldingPointers}>03</p>
            </div>
            <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
              <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                HOME LOAN ASSISTANCE
              </h4>
              <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
              We offer various home loan solutions from top loan providers that are tailored to your needs,
                so that you can secure the best offers and
                terms for your home loan.
              </p>
            </div>
          </div>
          <div className={`${styles.servicePageFirstPointImgWrapper} ${styles.noBottomMargin}`}>
            <img
              className={styles.servicePageFirstPointImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/keyHandOver.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className={`${styles.servicePageFirstPointImgBgrd} ${styles.servicePageFirstPointImgBgrdRight}`} />
          </div>
          <div className={styles.servicePageThirdPointDescriptionWrapper}>
            <div className={styles.servicePageThirdPointDescriptionHeaderFlex}>
              <p className={styles.servicePageHandHoldingPointers}>04</p>
            </div>
            <div className={styles.servicePageThirdPointDescriptionContentWrapper}>
              <h4 className={styles.servicePageThirdPointDescriptionContentHeader}>
                KEY HANDOVER
              </h4>
              <p className={styles.servicePageThirdPointDescriptionContentHeaderData}>
                Experience a smooth key handover, where each and every detail is
                managed to ensure a smooth and effortless move-in to your dream
                home.
              </p>
            </div>
          </div>
        </div>
      )}

      {isDesktop ? (
        <div className={styles.servicePageResaleContainer} id="Resale-Services">
          <div className={styles.servicePageResaleDescriptionWrapper}>
            <div className={styles.servicePageResaleDescriptionHeaderContainer}>
              <div className={styles.servicePageResaleDescriptionHeaderContainerRight}>
                <img
                  className={styles.servicePageFirstPointDescriptionHeaderIcon}
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/resaleServices.svg"
                  alt="resale service"
                />
              </div>
              <div className={styles.servicePageResaleDescriptionHeaderContainerLeft}>
                <h4>RESALE SERVICES</h4>
              </div>
            </div>
            <p>
              Unlock your property`s value with InfraMantra`s premium resale
              services offering top-notch marketing, seamless negotiations, and
              full legal support. Sell faster and smarter with us!
            </p>
            <button
              btnText="Contact Now"
              width="250px"
              otherStyles={{ fontSize: '20px', fontWeight: '700' }}
              onClick={() => navigate('/contact-us')}
            />
          </div>
          <div className={styles.servicePageResaleImgWrapper}>
            <img
              className={styles.servicePageResaleImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/resale.avif"
              alt="aboutUsPageHeaderImg"
            />
          </div>
        </div>
      ) : (
        <div className={styles.servicePageResaleContainer} id="Resale-Services">
          <div className={styles.servicePageFirstPointDescriptionHeaderFlex}>
            <img
              className={styles.servicePageFirstPointDescriptionHeaderIcon}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/resaleServices.svg"
              alt="resale service"
            />
            <h4>RESALE SERVICES</h4>
          </div>
          <div className={styles.servicePageResaleImgWrapper}>
            <img
              className={styles.servicePageResaleImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/resale.avif"
              alt="aboutUsPageHeaderImg"
            />
          </div>
          <p>
            Unlock your property`s value with InfraMantra`s premium resale
            services offering top-notch marketing, seamless negotiations, and
            full legal support. Sell faster and smarter with us!
          </p>
          <button
            btnText="Contact Now"
            width="150px"
            otherStyles={{ fontSize: '13px', fontWeight: '500' }}
            onClick={() => navigate('/contact-us')}
          />
        </div>
      )}
    </div>
    </Wrapper>
  );
}

export default ServicesPage;



