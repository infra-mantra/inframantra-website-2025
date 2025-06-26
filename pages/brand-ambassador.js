import React from "react";
import Wrapper from "../components/UI/Wrapper";
import PageHeader from '../components/brandAmbassador/pageHeader'
import AmbProfile from "../components/brandAmbassador/ambProfile";
import VideoEmbed from "../components/brandAmbassador/Embed";
import AmbGallery from "../components/brandAmbassador/ambGallery";
import Steps from "../components/brandAmbassador/discoverAmb";


const BrandAmbassador = () => {
    const banner_data = {
        title: "Brand Ambassador",
        image: '/assets/guru/guru-main-banner.jpg',
    }
    const data = {
       meta_title : "Guru Randhawa X InfraMantra - Brand Ambassador Of InfraMantra",
       meta_description: "InfraMantra, a leading real estate company has signed Bollywood singing superstar Guru Randhawa as its official brand ambassador. Check here the complete details now.",
       meta_keyword: "Guru Randhawa, InfraMantra, Brand Ambassador, Bollywood, Real Estate Company"
    }
    return (
      <Wrapper
         title={data.meta_title}
         description={data.meta_description}
         keyword={data.meta_keyword}
         
      >
        <PageHeader data={banner_data} />
        <AmbProfile />
        <VideoEmbed/>
        <AmbGallery/>
        <Steps />
      </Wrapper>
    );
}

export default BrandAmbassador;

