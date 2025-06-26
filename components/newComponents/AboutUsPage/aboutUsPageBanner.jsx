import React, { useState, useEffect } from "react";

import { FaRegEye } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";

import CustomizedSteppers from './aboutUsTimeline/aboutUsTimeline';
import AboutUsTimelineContent from './aboutUsTimeline/aboutUsTimelineContent';
import CoreValues from "./coreValues";
import MeetOwners from "./meetTheOwners";
import BrandAmbassador from "./brandAmbassador";
import AwardsSlider from "./awardSlider";
import MeetTheTeam from "./meettheTeam";
import DeveloperSlider from "./developerSlider";

const AboutUsPageHeader = () => {
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };
    const checkScreenWidth = () => {
        setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
        setIsMobile(window.innerWidth <= 768);
    };
    useEffect(() => {
        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);

        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);

    const BannerImage = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/about%20us%20banner%20final.avif';
    const MobileBannerImage = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/About%20us%20banner%20Phone.avif';
    return (
        <>
            <div className="aboutUsPageHeader">
                <h2>Hi There</h2>
                <h2>
                    We`re{' '}
                    <span style={{ color: '#DCAA4C', fontWeight: '700' }}>
                        INFRAMANTRA
                    </span>
                </h2>
            </div>
            <div className="aboutUsPageHeaderImgContainer">
                <img
                    src={isDesktop ? BannerImage : MobileBannerImage}
                    alt="aboutUsPageHeaderImg"
                    className="aboutUsPageHeaderImg"
                />
            </div>
            <p className="aboutUsPageHeaderDescription">
                INFRAMANTRA stands as a premier PropTech advisory firm with a mission to
                guide clients seamlessly through the journey of searching, discovering,
                purchasing, and managing residential and commercial properties built by
                India’s top real estate developers.
            </p>
            <p className="aboutUsPageHeaderDescription">
                Rooted in a process-oriented approach, we ensure every home buying
                experience remains deeply customer-centric, embodying our core value of
                respect for all individuals. Discover a new standard in property
                advisory with INFRAMANTRA, where expertise meets excellence, and your
                aspirations find their perfect match.
            </p>
            <div className="aboutUsPageVisionContainer">
                <div className="aboutUsPageVisionFlex">
                    <FaRegEye className="targetIcon" sx={{ fontSize: '2.5rem', color: '#0B8C27' }} />
                    <p className="aboutUsPageVisionHeader">Our Vision</p>
                    <p className="aboutUsPageVisionContent">
                        To be the most preferred partner for all real estate stakeholders
                        through transparency, simplicity, and choice.
                    </p>
                </div>
                <div className="aboutUsPageVisionFlex">
                    <TbTargetArrow className="targetIcon" sx={{ fontSize: '2.5rem', color: '#0B8C27' }} />
                    <p className="aboutUsPageVisionHeader">Our Mission</p>
                    <p className="aboutUsPageVisionContent">
                        We aim to build a dynamic market landscape through innovative
                        strategies and new-age marketing tools, creating a seamless value
                        chain that includes end-users, industry stakeholders, and investors.
                        Our commitment to {' " '}Making Realty a Reality for You{' " '} ensures that we
                        turn dreams into reality, one property at a time.
                    </p>
                </div>
            </div>
            <div className="aboutUsPageTimelineWrapper">
                <AboutUsTimelineContent currentStep={currentStep} />
                <CustomizedSteppers currentStep={handleStepChange} />
            </div>
            <CoreValues />
            <MeetOwners />
            <div className="aboutUsPageStatisticalDataWrapper">
                <div className="aboutUsPageStatisticalDataItemContainer  aboutUsPageStatisticalDataItemContainer1">
                    <div className="aboutUsPageStatisticalDataItem">
                        <h4>2017</h4>
                        <p>Founded In</p>
                    </div>
                </div>
                <div className="aboutUsPageStatisticalDataItemContainer aboutUsPageStatisticalDataItemContainer2 bottomStyledStats">
                    <div className="aboutUsPageStatisticalDataItem bottomStyledStatsItem">
                        <h4>50+</h4>
                        <p>Awards & Recognition</p>
                    </div>
                </div>
                <div className="aboutUsPageStatisticalDataItemContainer aboutUsPageStatisticalDataItemContainer3">
                    <div className="aboutUsPageStatisticalDataItem">
                        <h4>45000</h4>
                        <p>Customers Reached</p>
                    </div>
                </div>
            </div>
            <BrandAmbassador />
            {/* <AwardsSlider/> */}
            <DeveloperSlider />
            <MeetTheTeam/>
        </>
    )
};


export default AboutUsPageHeader;