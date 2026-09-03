import React from "react";
import Wrapper from "../components/shared/Wrapper.jsx";
import PageHeader from "../components/brand-ambassador/PageHeader.jsx";
import AmbProfile from "../components/brand-ambassador/AmbProfile.jsx";
import VideoEmbed from "../components/brand-ambassador/Embed.jsx";
import AmbGallery from "../components/brand-ambassador/AmbGallery.jsx";
import Steps from "../components/brand-ambassador/DiscoverAmb.jsx";

const BrandAmbassador = () => {
  const banner_data = {
    title: "Brand Ambassador",
    image:
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/brandAmbassador/guru-main-banner.jpg",
  };
  const data = {
    meta_title: "Guru Randhawa X InfraMantra - Brand Ambassador Of InfraMantra",
    meta_description:
      "InfraMantra, a leading real estate company has signed Bollywood singing superstar Guru Randhawa as its official brand ambassador. Check here the complete details now.",
    meta_keyword: "Guru Randhawa, InfraMantra, Brand Ambassador, Bollywood, Real Estate Company",
  };
  return (
    <Wrapper
      title={data.meta_title}
      description={data.meta_description}
      keyword={data.meta_keyword}
    >
      <PageHeader data={banner_data} />
      <AmbProfile />
      <VideoEmbed />
      <AmbGallery />
      <Steps />
    </Wrapper>
  );
};

export default BrandAmbassador;
