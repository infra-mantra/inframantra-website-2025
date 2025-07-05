import React, { useState, useCallback } from 'react';
import { IoMdMenu, IoMdCall, IoMdMail, IoMdPin } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import { FaHome, FaBuilding } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { MdContactMail, MdOutlineSpeakerNotes, MdOutlinePermMedia, MdOutlineGavel, MdOutlinePolicy, MdOutlineReportProblem } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { PiHandshakeThin } from "react-icons/pi";
import { SocialIcon } from 'react-social-icons';
import { useRouter } from 'next/router';

const MobileMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
  };

  const isActive = (path) => {
    return router.pathname === `/${path}` ? '#E4A01D' : '#00000';
  };

  const handleNavigation = useCallback((path) => {
    let finalPath = `/${path}`;
    if (finalPath.includes('/page/page')) {
      finalPath = finalPath.replace('/page/page', '/page');
    }

    if (router.pathname !== finalPath) {
      router.push(finalPath);
    }
    setOpen(false); // Always close drawer after navigation
  }, [router]);

  const DrawerList = (
    <div style={{
      width: '100vw',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: '20px',
      overflowX: 'hidden',
    }}>
      {/* Header with Logo and Close Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , color:"#0000"}}>
        <img
          src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogoBlack.png"
          alt="Inframantra Logo"
          style={{ width: '150px' }}
        />
       <IoClose size={30} onClick={toggleDrawer(false)} style={{ cursor: 'pointer', color: "#000" }} />

      </div>

      {/* Navigation Items */}
      <div style={{ marginTop: '30px' }}>
        <MenuItem icon={<FaHome />} text="Home" path="" onClick={handleNavigation} activeColor={isActive('')} />
        <MenuItem icon={<FaBuilding />} text="Properties" path="property-listing/city/Gurgaon" onClick={handleNavigation} activeColor={isActive('property-listing/city/Gurgaon')} />
        <MenuItem icon={<GrServices />} text="Services" path="our-services" onClick={handleNavigation} activeColor={isActive('our-services')} />
        <MenuItem icon={<MdContactMail />} text="Contact Us" path="contact-us" onClick={handleNavigation} activeColor={isActive('contact-us')} />
      </div>

      <Divider />

      {/* Secondary Nav */}
      <MenuItem icon={<IoIosPeople />} text="About Us" path="about-us" onClick={handleNavigation} activeColor={isActive('about-us')} />
      <MenuItem icon={<MdOutlineSpeakerNotes />} text="Testimonials" path="testimonials" onClick={handleNavigation} activeColor={isActive('testimonials')} />
      <MenuItem icon={<MdOutlinePermMedia />} text="Media And Blogs" path="blog" onClick={handleNavigation} activeColor={isActive('blog')} />

      <Divider />

      {/* Tertiary Nav */}
      <MenuItem icon={<MdOutlineGavel />} text="Terms And Conditions" path="page/terms-conditions" onClick={handleNavigation} activeColor={isActive('page/terms-conditions')} />
      <MenuItem icon={<MdOutlinePolicy />} text="Privacy Policy" path="page/privacy-policy" onClick={handleNavigation} activeColor={isActive('page/privacy-policy')} />
      <MenuItem icon={<MdOutlineReportProblem />} text="Disclaimer" path="page/disclaimer" onClick={handleNavigation} activeColor={isActive('page/disclaimer')} />
      <MenuItem icon={<PiHandshakeThin />} text="User Agreement" path="page/user-agreement" onClick={handleNavigation} activeColor={isActive('page/user-agreement')} />

      <Divider />

      {/* Social Icons */}
      <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Social Media Links</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <SocialIcon url="https://x.com/INFRAMANTRA_" />
        <SocialIcon url="https://instagram.com/inframantraofficial" />
        <SocialIcon url="https://youtube.com/@inframantraofficial" />
        <SocialIcon url="https://facebook.com/inframantraofficial" />
        <SocialIcon url="https://pinterest.com/inframantraofficial" />
        <SocialIcon url="https://linkedin.com/company/inframantra" />
      </div>

      <Divider />

      {/* Company Details */}
      <div style={{ marginTop: '10px' }}>
        <DetailItem icon={<IoMdCall style={{ color: '#E4A951' }} />} text="+91 86 9800 9900" />
        <DetailItem icon={<IoMdMail style={{ color: '#E4A951' }} />} text="info@inframantra.com" />
        <DetailItem icon={<IoMdPin style={{ color: '#E4A951' }} />} text="95, Institutional Area, Sector 32, Gurugram, Haryana 122002" />
      </div>
    </div>
  );

  return (
    <div>
      <IoMdMenu size={30} onClick={toggleDrawer(true)} style={{ cursor: 'pointer' }} />
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1200,
        }}>
          <div style={{
            position: 'relative',
            width: '80%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: '#fff',
          }}>
            {DrawerList}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const MenuItem = ({ icon, text, path, onClick, activeColor }) => (
  <div
    onClick={() => onClick(path)}
    style={{ display: 'flex', alignItems: 'center', padding: '10px 0', cursor: 'pointer', color: activeColor }}
  >
    <span style={{ marginRight: '10px' }}>{icon}</span>
    <span>{text}</span>
  </div>
);

const DetailItem = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
    {icon}
    <p style={{ marginLeft: '10px' }}>{text}</p>
  </div>
);

const Divider = () => (
  <div style={{ width: '100%', height: '1px', backgroundColor: '#ccc', margin: '15px 0' }} />
);

export default MobileMenu;
