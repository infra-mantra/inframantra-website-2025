import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import Wrapper from '../../components/UI/Wrapper';
import Header from '../../components/nri/header';
import AboutSection from '../../components/nri/aboutSection';
import UpcomingProjectsSection from '../../components/nri/projectSlider';
import WhyInvest from '../../components/nri/WhyInvest';
import Faq from '../../components/nri/FAQ';
import ProjecMap from '../../components/nri/ProjectMap';
import Sticky from '../../components/nri/StickySidebar';

function Nri() {
  const router = useRouter();

  const { source } = router.query;

  // Store source globally
  useEffect(() => {
    if (source) {
      localStorage.setItem('campaign_source', source);
    }
  }, [source]);

  // Sticky sidebar visibility
  useEffect(() => {
    const header = document.getElementById('nriHeader');
    const sidebar = document.querySelector('.sidebarst');
    const elements = document.querySelector('.cta_visible');

    if (elements) {
      elements.style.display = 'none';
    }

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

  // Debug
  useEffect(() => {
    console.log('Campaign Source:', source);
  }, [source]);

  return (
    <Wrapper
      title="Gurgaon Premium Luxury Residences for NRIs | INFRAMANTRA"
      description="Explore Gurgaon premium luxury residences for NRIs with INFRAMANTRA. Discover top projects, exclusive pricing, and secure high-return real estate investments."
    >
      {/* HEADER */}
      <section id="nriHeader">
        <Header name="USA-EXPO YUPP TV"/>
      </section>

      {/* ABOUT */}
      <section id="NriAbout">
        <AboutSection name="USA-EXPO YUPP TV" />
      </section>

      {/* PROJECTS */}
      <UpcomingProjectsSection name="USA-EXPO YUPP TV" />

      {/* MAP */}
      <ProjecMap />

      {/* WHY INVEST */}
      <WhyInvest name="USA-EXPO YUPP TV" />

      {/* FAQ */}
      <Faq name="USA-EXPO YUPP TV" />

      {/* STICKY SIDEBAR */}
      <Sticky name="USA-EXPO YUPP TV"/>
    </Wrapper>
  );
}

export default Nri;