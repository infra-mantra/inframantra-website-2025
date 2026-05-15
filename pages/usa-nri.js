import React, { useEffect } from 'react';
import Wrapper from '../components/UI/Wrapper';
import Header from '../components/nri/header';
import AboutSection from '../components/nri/aboutSection';
import UpcomingProjectsSection from '../components/nri/projectSlider';
import WhyInvest from '../components/nri/WhyInvest';
import Faq from '../components/nri/FAQ';
import ProjecMap from '../components/nri/ProjectMap';
import Sticky from '../components/nri/StickySidebar';

function Nri() {

 useEffect(() => {
  const header = document.getElementById('nriHeader');
  const sidebar = document.querySelector('.sidebarst');
  const elements = document.querySelector('.cta_visible');
  elements.style.display ='none'

  if (!header || !sidebar) return;

  const observer = new IntersectionObserver(
    ([entry]) => {

    

      sidebar.style.display = entry.isIntersecting ? 'none' : 'flex';
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(header);

  return () => observer.disconnect();
}, []);

  return (
    <Wrapper
      title="Gurgaon Premium Luxury Residences for NRIs | INFRAMANTRA"
      description="Explore Gurgaon premium luxury residences for NRIs with INFRAMANTRA. Discover top projects, exclusive pricing, and secure high-return real estate investments."
    >

      {/* HEADER */}
      <section id="nriHeader">
        <Header  name = "USA-EXPO (Event Specific)"/>
      </section>

      {/* OTHER SECTIONS */}
      <section id="NriAbout">
        <AboutSection  name = "USA-EXPO (Event Specific)" />
      </section>

      <UpcomingProjectsSection name = "USA-EXPO (Event Specific)"/>
      <ProjecMap />
      <WhyInvest />
      <Faq name = "USA-EXPO (Event Specific)"/>

      
        <Sticky name = "USA-EXPO (Event Specific)" />
      

    </Wrapper>
  );
}

export default Nri;
