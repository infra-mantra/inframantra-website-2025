import React,{useEffect}from 'react'
import EventInfo from '../components/event.js/eventInfo'
import ProjecMap from '../components/nri/ProjectMap';
import Sticky from '../components/nri/StickySidebar';
import Wrapper from '../components/UI/Wrapper';

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
    <Wrapper>
    <EventInfo/>
    <ProjecMap/>
      
            <Sticky />
            </Wrapper>
    </>
  )
}

export default UsaExpoEvent