import React,{useEffect}from 'react'
import EventInfo from '../components/events/eventInfo'
import ProjecMap from '../components/nri/ProjectMap';
import Sticky from '../components/nri/StickySidebar';
import Wrapper from '../components/UI/Wrapper';
import EventGallery from '../components/events/formGallery';
import Faq from '../components/nri/FAQ';
import Header from '../components/events/HeaderSec';
import AboutEvent from '../components/events/aboutEvent';

function UsaExpoEvent() {   
     useEffect(() => {
    
      const sidebar = document.querySelector('.sidebarst');
      const elements = document.querySelector('.cta_visible');
      elements.style.display ='none'
      const observer = new IntersectionObserver(
        ([entry]) => {
          sidebar.style.display = entry.isIntersecting ? 'none' : 'flex';
        },
        {
          threshold: 0.1,
        }
      );
      return () => observer.disconnect();
    }, []);

  return (
    <>
    <Wrapper
    title="USA Expo for NRIs | Luxury Residences in India | INFRAMANTRA"
    description="Explore luxury residences in India at the Inframantra USA Expo for NRIs. Discover premium investment opportunities with expert guidance—limited seats available."
    >
    <Header name="USA-EXPO (Event Specific)"/>
    <AboutEvent name="USA-EXPO (Event Specific)"/>
    <EventGallery/>
    <EventInfo/>
    <Sticky name="USA-EXPO (Event Specific)" url="/usa-nri" />
    </Wrapper>
    </>
  )
}

export default UsaExpoEvent