
import React, { useEffect,useState } from 'react';
import Wrapper from '../components/UI/Wrapper';

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
      <div className="servicePageWrapper">
      <h1 className="servicePageHeader">OUR SERVICES</h1>
      <hr className="servicePageHeaderBorderBottom" />
      <div></div>
      {isDesktop ? (
        <div className="servicePageFirstSalePointContainer" id="Site-Visits">
          <div className="servicePageFirstPointImgWrapper">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/siteVisit.avif"
              alt="Inframantra Site Visit"
            />
            <div className="servicePageFirstPointImgBgrd" />
          </div>
          <div className="servicePageFirstPointDescriptionWrapper">
            <div className="servicePageFirstPointDescriptionHeaderFlex">
              <img
                className="servicePageFirstPointDescriptionHeaderIcon"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/siteVisits.svg"
                alt="siteVisit"
              />
              <h4>SITE VISIT</h4>
            </div>
            <div className="servicePageFirstPointDescriptionContentWrapper">
              <p>
                Explore your dream home with our property experts and understand
                every detail like surroundings, locality, and all the amenities
                of the project.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="servicePageFirstSalePointContainer" id="Site-Visits">
          <div className="servicePageFirstPointDescriptionHeaderFlex">
            <img
              className="servicePageFirstPointDescriptionHeaderIcon"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/siteVisits.svg"
              alt="siteVisit"
            />
            <h4>SITE VISIT</h4>
          </div>
          <div className="servicePageFirstPointImgWrapper">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/siteVisit.avif"
              alt="Inframantra Site Visit"
            />
            <div className="servicePageFirstPointImgBgrd" />
          </div>
          <div className="servicePageFirstPointDescriptionContentWrapper">
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
          <div className="servicePageFirstSalePointContainer" id="Consultancy">
            <div className="servicePageFirstPointDescriptionWrapper servicePageFirstPointDescriptionWrapperSecondSectionNew">
              <div className="servicePageFirstPointDescriptionHeaderFlex">
                <img
                  className="servicePageFirstPointDescriptionHeaderIcon"
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/consultancy.svg"
                  alt="siteVisit"
                />
                <h4>CONSULTANCY</h4>
              </div>
              <div className="servicePageFirstPointDescriptionContentWrapper">
                <p>
                  Get valuable insights and personalised advice from our real
                  estate consultants, who will help you out in exploring
                  the best options, and finalise your dream home.
                </p>
              </div>
            </div>
            <div className="servicePageFirstPointImgWrapper servicePageFirstPointImgWrapperSecondSectionNew">
              <img
                className="servicePageFirstPointImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/consultancy.avif"
                alt="Inframantra Consultancy"
              />
              <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdSecondSectionNew" />
            </div>
          </div>
          <div className="servicePageSecondSectionIconWrapper">
            <div className="servicePageSecondSectionIconFlexContainer">
              <div className="servicePageSecondSectionIconFlex">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Market%20analysis%20and%20insights.svg"
                  alt="Market Analysis And Insights"
                />
                <p
                > Market Analysis And Insights </p>
              </div>
              <div></div>
            </div>
            <div className="servicePageSecondSectionIconFlexContainer">
              <div></div>
              <div className="servicePageSecondSectionIconFlex">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Assistance%20with%20legal%20and%20regulatory%20requirements.svg"
                  alt="Market Analysis And Insights"
                />
                <p> Assistance with Legal and Regulatory Requirements</p>
              </div>
            </div>
            <div className="servicePageSecondSectionIconFlexContainer">
              <div className="servicePageSecondSectionIconFlex">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Investment%20optimization%20strategies.svg"
                  alt="Market Analysis And Insights"
                />
              <p> Investment Optimization Strategies</p>
              </div>
              <div></div>
            </div>
            <div className="servicePageSecondSectionIconFlexContainer">
              <div></div>
              <div className="servicePageSecondSectionIconFlex">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Personalized%20real%20estate%20advice.svg"
                  alt="Market Analysis And Insights"
                />
                <p> Personalized Real Estate Advice </p>
              </div>
            </div>
            <div className="servicePageSecondSectionIconFlexContainer">
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
        <div className="servicePageFirstSalePointContainer" id="Consultancy">
          <div className="servicePageFirstPointDescriptionHeaderFlex">
            <img
              className="servicePageFirstPointDescriptionHeaderIcon"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/consultancy.svg"
              alt="consultancy"
            />
            <h4>CONSULTANCY</h4>
          </div>
          <div className="servicePageFirstPointImgWrapper">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/consultancy.avif"
              alt="Inframantra Consultancy"
            />
            <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdRight" />
          </div>
          <div className="servicePageFirstPointDescriptionContentWrapper">
            <p>
              Get valuable insights and personalised advice from our real estate
              consultants, who will help you out in exploring the best options,
              and finalise your dream home.
            </p>
          </div>
          <div className="servicePageSecondPointIconsContainer">
            <div className="servicePageSecondPointIconsColumnFlexContainer">
              <div className="servicePageSecondPointIconFlex iconContentFlexStart">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Market%20analysis%20and%20insights.svg"
                  alt="Market Analysis And Insights"
                  className="servicePageSecondPointIconStyles"
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
              <div className="servicePageSecondPointIconFlex iconContentFlexEnd ">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Assistance%20with%20legal%20and%20regulatory%20requirements.svg"
                  alt="Market Analysis And Insights"
                  className="servicePageSecondPointIconStyles"
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
                  className="servicePageSecondPointIconStyles"
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
              <div className="servicePageSecondPointIconFlex iconContentFlexEnd">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Personalized%20real%20estate%20advice.svg"
                  alt="Market Analysis And Insights"
                  className="servicePageSecondPointIconStyles"
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
              <div className="servicePageSecondPointIconFlex iconContentFlexStart">
                <img
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/Customized%20solutions%20for%20buying,%20selling,%20or%20leasing%20properties.svg"
                  alt="Market Analysis And Insights"
                  className="servicePageSecondPointIconStyles"
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
        <div className="servicePageThirdSalePointContainer" id="Hand-Holding">
          <div className="servicePageThirdSalePointDescriptionHeaderFlex">
            <img
              className="servicePageFirstPointDescriptionHeaderIcon"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/handHolding.svg"
              alt="hand holding"
            />
            <h2>Seamless Assistance</h2>
          </div>
          <p className="servicePageThirdSalePointDescription">
            From home assistance to key handover, we ensure a seamless and a
            hassle-free experience, letting you settle into your new home with
            ease.
          </p>
          <div className="servicePageFirstSalePointContainer">
            <div className="servicePageFirstPointImgWrapper">
              <img
                className="servicePageFirstPointImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/paperWork.avif"
                alt="Inframantra Documentation"
              />
              <div className="servicePageFirstPointImgBgrd" />
            </div>
            <div className="servicePageThirdPointDescriptionWrapper">
              <div className="servicePageThirdPointDescriptionHeaderFlex">
                <p className="servicePageHandHoldingPointers">01</p>
              </div>
              <div className="servicePageThirdPointDescriptionContentWrapper">
                <h4 className="servicePageThirdPointDescriptionContentHeader">
                  DOCUMENTATION
                </h4>
                <p className="servicePageThirdPointDescriptionContentHeaderData">
                  Simplify your paperwork with our expert help, ensuring a
                  smooth, hassle-free transaction at every step, so that you can experience
                  efficiency and ease like never before.
                </p>
              </div>
            </div>
          </div>
          <div className="servicePageFirstSalePointContainer">
            <div className="servicePageFirstPointImgWrapper">
              <img
                className="servicePageFirstPointImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/developerCordination.avif"
                alt="Inframantra Developer coordination"
              />
              <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdRight" />
            </div>
            <div className="servicePageThirdPointDescriptionWrapper">
              <div className="servicePageThirdPointDescriptionHeaderFlex">
                <p className="servicePageHandHoldingPointers">02</p>
              </div>
              <div className="servicePageThirdPointDescriptionContentWrapper">
                <h4 className="servicePageThirdPointDescriptionContentHeader">
                  DEVELOPER COORDINATION
                </h4>
                <p className="servicePageThirdPointDescriptionContentHeaderData">
                  Easily connect with developers through our premium services, timely updates and smooth communication throughout
                  your home-buying journey. We ensure a streamlined experience
                  from start to finish!
                </p>
              </div>
            </div>
          </div>
          <div className="servicePageFirstSalePointContainer">
            <div className="servicePageFirstPointImgWrapper">
              <img
                className="servicePageFirstPointImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/homeAssisstance.avif"
                alt="aHome Loan"
              />
              <div className="servicePageFirstPointImgBgrd" />
            </div>
            <div className="servicePageThirdPointDescriptionWrapper">
              <div className="servicePageThirdPointDescriptionHeaderFlex">
                <p className="servicePageHandHoldingPointers">03</p>
              </div>
              <div className="servicePageThirdPointDescriptionContentWrapper">
                <h4 className="servicePageThirdPointDescriptionContentHeader">
                  HOME LOAN ASSISTANCE
                </h4>
                <p className="servicePageThirdPointDescriptionContentHeaderData">
                  We offer various home loan solutions from top loan providers that are tailored to your needs,
                  so that you can secure the best offers and
                  terms for your home loan.
                </p>
              </div>
            </div>
          </div>
          <div className="servicePageFirstSalePointContainer">
            <div className="servicePageFirstPointImgWrapper">
              <img
                className="servicePageFirstPointImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/keyHandOver.avif"
                alt="Key Hand Over"
              />
              <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdRight" />
            </div>
            <div className="servicePageThirdPointDescriptionWrapper">
              <div className="servicePageThirdPointDescriptionHeaderFlex">
                <p className="servicePageHandHoldingPointers">04</p>
              </div>
              <div className="servicePageThirdPointDescriptionContentWrapper">
                <h4 className="servicePageThirdPointDescriptionContentHeader">
                  KEY HANDOVER
                </h4>
                <p className="servicePageThirdPointDescriptionContentHeaderData">
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
          className="servicePageFirstSalePointContainer"
          style={{ marginTop: '25px' }}
          id="Hand-Holding"
        >
          <div className="servicePageFirstPointDescriptionHeaderFlex">
            <img
              className="servicePageFirstPointDescriptionHeaderIcon"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/handHolding.svg"
              alt="hand holding"
            />
            <h4>Seamless Assistance</h4>
          </div>
          <div className="servicePageFirstPointDescriptionContentWrapper">
            <p style={{ marginBottom: '35px' }}>
              From home assistance to key handover, we ensure a seamless and a
              hassle-free experience, letting you settle into your new home with
              ease.
            </p>
          </div>
          <div className="servicePageFirstPointImgWrapper noBottomMargin">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/paperWork.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className="servicePageFirstPointImgBgrd" />
          </div>
          <div className="servicePageThirdPointDescriptionWrapper">
            <div className="servicePageThirdPointDescriptionHeaderFlex">
              <p className="servicePageHandHoldingPointers">01</p>
            </div>
            <div className="servicePageThirdPointDescriptionContentWrapper">
              <h4 className="servicePageThirdPointDescriptionContentHeader">
                DOCUMENTATION
              </h4>
              <p className="servicePageThirdPointDescriptionContentHeaderData">
                Simplify your paperwork with our expert help, ensuring a smooth,
                hassle-free transaction at every step, so that you can experience efficiency
                and ease like never before.
              </p>
            </div>
          </div>
          <div className="servicePageFirstPointImgWrapper noBottomMargin">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/developerCordination.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdRight" />
          </div>
          <div className="servicePageThirdPointDescriptionWrapper">
            <div className="servicePageThirdPointDescriptionHeaderFlex">
              <p className="servicePageHandHoldingPointers">02</p>
            </div>
            <div className="servicePageThirdPointDescriptionContentWrapper">
              <h4 className="servicePageThirdPointDescriptionContentHeader">
                DEVELOPER COORDINATION
              </h4>
              <p className="servicePageThirdPointDescriptionContentHeaderData">
                Easily connect with developers through our premium
                services, timely updates and smooth communication throughout
                your home-buying journey. We ensure a streamlined experience
                from start to finish!
              </p>
            </div>
          </div>
          <div className="servicePageFirstPointImgWrapper noBottomMargin">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/homeAssisstance.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className="servicePageFirstPointImgBgrd" />
          </div>
          <div className="servicePageThirdPointDescriptionWrapper">
            <div className="servicePageThirdPointDescriptionHeaderFlex">
              <p className="servicePageHandHoldingPointers">03</p>
            </div>
            <div className="servicePageThirdPointDescriptionContentWrapper">
              <h4 className="servicePageThirdPointDescriptionContentHeader">
                HOME LOAN ASSISTANCE
              </h4>
              <p className="servicePageThirdPointDescriptionContentHeaderData">
              We offer various home loan solutions from top loan providers that are tailored to your needs,
                so that you can secure the best offers and
                terms for your home loan.
              </p>
            </div>
          </div>
          <div className="servicePageFirstPointImgWrapper noBottomMargin">
            <img
              className="servicePageFirstPointImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/keyHandOver.avif"
              alt="aboutUsPageHeaderImg"
            />
            <div className="servicePageFirstPointImgBgrd servicePageFirstPointImgBgrdRight" />
          </div>
          <div className="servicePageThirdPointDescriptionWrapper">
            <div className="servicePageThirdPointDescriptionHeaderFlex">
              <p className="servicePageHandHoldingPointers">04</p>
            </div>
            <div className="servicePageThirdPointDescriptionContentWrapper">
              <h4 className="servicePageThirdPointDescriptionContentHeader">
                KEY HANDOVER
              </h4>
              <p className="servicePageThirdPointDescriptionContentHeaderData">
                Experience a smooth key handover, where each and every detail is
                managed to ensure a smooth and effortless move-in to your dream
                home.
              </p>
            </div>
          </div>
        </div>
      )}

      {isDesktop ? (
        <div className="servicePageResaleContainer" id="Resale-Services">
          <div className="servicePageResaleDescriptionWrapper">
            <div className="servicePageResaleDescriptionHeaderContainer">
              <div className="servicePageResaleDescriptionHeaderContainerRight">
                <img
                  className="servicePageFirstPointDescriptionHeaderIcon"
                  src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/resaleServices.svg"
                  alt="resale service"
                />
              </div>
              <div className="servicePageResaleDescriptionHeaderContainerLeft">
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
          <div className="servicePageResaleImgWrapper">
            <img
              className="servicePageResaleImg"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/servicesPage/resale.avif"
              alt="aboutUsPageHeaderImg"
            />
          </div>
        </div>
      ) : (
        <div className="servicePageResaleContainer" id="Resale-Services">
          <div className="servicePageFirstPointDescriptionHeaderFlex">
            <img
              className="servicePageFirstPointDescriptionHeaderIcon"
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/resaleServices.svg"
              alt="resale service"
            />
            <h4>RESALE SERVICES</h4>
          </div>
          <div className="servicePageResaleImgWrapper">
            <img
              className="servicePageResaleImg"
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




// import React from "react";
// import Wrapper from "../components/UI/Wrapper";
// import PageHeader from "../components/UI/PageHeader";
// import Section from "../components/UI/Section";
// import Image from "next/image";
// import Link from "next/link";

// const OurServices = ({ allData }) => {
//   const data = {
//     image: allData.heading.image,
//     title: allData.heading.meta_title,
//   };
// //   console.log(allData.services);
//   return (
//     <Wrapper
//       title={allData.heading.meta_title}
//       description={allData.heading.meta_description}
//       image={allData.heading.image}
//     >
//       <PageHeader data={data} />
//       <Section >
//       <h2 className="service-section">Our Core Services</h2>
//          <div className="service-section-wrap">
//               <div className="section-service-item">
//                  <div className="img-wrap">
//                     <Image src={allData.services[0].file.path} alt={allData.services[0].name} layout="fill"/>
//                  </div>
//                  <div className="info">
//                      <h2>{allData.services[0].name}</h2>
//                      <Link href={`/property-buying`}>
//                         <a className="lrn-btn">
//                            Read More
//                         </a>
//                      </Link>
//                  </div>
//               </div>
//               <div className="section-service-item">
//                  <div className="img-wrap">
//                     <Image src={allData.services[1].file.path} alt={allData.services[1].name} layout="fill"/>
//                  </div>
//                  <div className="info">
//                      <h2>{allData.services[1].name}</h2>
//                      <Link href={`/home-loans`}>
//                         <a className="lrn-btn">
//                            Read More
//                         </a>
//                      </Link>
//                  </div>
//               </div>
//               <div className="section-service-item">
//                  <div className="img-wrap">
//                     <Image src={allData.services[2].file.path} alt={allData.services[2].name} layout="fill"/>
//                  </div>
//                  <div className="info">
//                      <h2>{allData.services[2].name}</h2>
//                      <Link href={`home-interiors`}>
//                         <a className="lrn-btn">
//                            Read More
//                         </a>
//                      </Link>
//                  </div>
//               </div>
//               <div className="section-service-item">
//                  <div className="img-wrap">
//                     <Image src={allData.services[3].file.path} alt={allData.services[3].name} layout="fill"/>
//                  </div>
//                  <div className="info">
//                      <h2>{allData.services[3].name}</h2>
//                      <Link href={`/property-management-services`}>
//                         <a className="lrn-btn">
//                            Read More
//                         </a>
//                      </Link>
//                  </div>
//               </div>
//          </div>
//       </Section>
//     </Wrapper>
//   );
// };

// export async function getStaticProps() {
//   const res = await fetch(
//     `${process.env.apiUrl}/setting/getmeta?link=our-services`
//   );
//   // const res = await fetch(searchApi)
//   const data = await res.json();

//   const heading = {
//     name: data.result[0].name,
//     title: data.result[0].title,
//     meta_title: data.result[0].meta_title,
//     meta_description: data.result[0].meta_description,
//     meta_keywords: data.result[0].meta_keyword,
//     ...(data.result[0].file && { image: data.result[0].file.path }),
//   };
//   const res1 = await fetch(`${process.env.apiUrl}/home`);
//   const data1 = await res1.json();

//   const allData = {
//     heading: heading,
//     services: data1.result.services,
//   };
//   return {
//     props: {
//       allData,
//     },
//     revalidate: 10,
//   };
// }

// export default OurServices;
