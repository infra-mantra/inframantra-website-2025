import React, { useState, useEffect } from "react";
import styles from "../components/about/AboutUs.module.css";
import AboutSection from "../components/about/AboutUsPageBanner.jsx";
import Wrapper from "../components/shared/Wrapper.jsx";
import CoreValues from "../components/about/CoreValues.jsx";
import Achivement from "../components/about/Achievement.jsx";
import Developer from "../components/about/DeveloperSlider.jsx";
import BrandAmbassador from "../components/about/BrandAmbassador.jsx";
import Vision from "../components/about/Vision.jsx";

import dynamic from "next/dynamic";
const AwardsSlider = dynamic(() => import("../components/about/Award.jsx"), { ssr: false });

const AboutUsPageHeader = ({ allData }) => {
  const bannerTitle = allData?.meta?.bannerTitle || "";
  const metaTitle = allData?.meta?.meta_title || "";
  const metaDescription = allData?.meta?.meta_description || "";
  const bannerImage = allData?.meta?.bannerImage || "";

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Prevent SSR window error
    if (typeof window !== "undefined") {
      const checkScreenWidth = () => {
        setIsDesktop(window.innerWidth >= 768);
      };

      checkScreenWidth();
      window.addEventListener("resize", checkScreenWidth);

      return () => {
        window.removeEventListener("resize", checkScreenWidth);
      };
    }
  }, []);

  return (
    <Wrapper title={metaTitle} description={metaDescription}>
      <div>
        <AboutSection />
        <Vision />
        <CoreValues />
        <BrandAmbassador />

        <AwardsSlider />
        <Achivement />

        <Developer />
      </div>
    </Wrapper>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${process.env.apiUrl}/about`);
  const data = await res.json();

  const headingsData = data?.result?.heading?.[0] || {};
  const metaData = data?.result?.meta?.[0] || {};

  const heading = {
    year: headingsData.year,
    yearExperience: headingsData.yearExperience,
    description: headingsData.description,
    milestone: headingsData.milestone,
    milestoneDescription: headingsData.milestoneDescription,
    ourTeam: headingsData.ourTeam,
    teamDescription: headingsData.teamDescription,
    reraTitle: headingsData.reraTitle,
    reraDescription: headingsData.reraDescription,
    ourPartner: headingsData.ourPartner,
    partnerDescription: headingsData.partnerDescription,
  };

  const meta = {
    bannerTitle: metaData.title,
    meta_title: metaData.meta_title,
    meta_description: metaData.meta_description,
    bannerImage: metaData?.file?.path || "",
  };

  const partnerDataArray = (data?.result?.partnerList || []).map((p) => ({
    id: p._id,
    name: p.name,
    ...(p.slug && { slug: p.slug }),
    ...(p.file && { image: p.file.path }),
  }));

  const visionDataArray = (data?.result?.visionList || []).map((v) => ({
    id: v._id,
    name: v.name,
    description: v.description,
  }));

  const journeyDataArray = (data?.result?.journeyList || []).map((j) => ({
    id: j._id,
    year: j.year,
    description: j.description,
  }));

  const teamDataArray = (data?.result?.teamList || []).map((t) => ({
    id: t._id,
    name: t.name,
    designation: t.designation,
    slug: t.link,
    ...(t.file && { image: t.file.path }),
  }));

  const cityDataArray = (data?.result?.cityList || []).map((c) => ({
    id: c._id,
    name: c.name,
    rerano: c.rerano,
  }));

  const awardsData = data?.result?.awardList?.[0] || {};

  const awards = {
    title: awardsData.title,
    shortdescription: awardsData.shortdescription,
    description: awardsData.description,
    image: awardsData?.file?.path || "",
  };

  const allData = {
    meta,
    heading,
    vision: visionDataArray,
    journey: journeyDataArray,
    team: teamDataArray,
    partners: partnerDataArray,
    awards,
    city: cityDataArray,
  };

  return {
    props: {
      allData,
    },
    revalidate: 10,
  };
}

export default AboutUsPageHeader;
