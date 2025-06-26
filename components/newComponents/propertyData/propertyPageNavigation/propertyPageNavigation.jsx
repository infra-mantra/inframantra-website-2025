import React, { useState, useEffect, useRef, useCallback } from "react";
import { propertyPageNavigtionValues } from "./propertyPageNavigtionValues";

const tabStyles = {
  fontSize: "18px",
  textTransform: "none",
  cursor: "pointer",
  padding: "10px 15px",
  transition: "all 0.3s ease-in-out",
};

const PropertyPageNavigation = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [value, setValue] = useState(0);
  const navRef = useRef(null);

  // Function to handle tab click
  const handleChange = (index) => {
    setValue(index);

    // Add a delay to ensure proper scroll positioning
    setTimeout(() => {
      const section = document.getElementById(propertyPageNavigtionValues[index].section);
      if (section) {
        let headerOffset = 160;
        if (index === 2) {
          headerOffset = 200;
        }

        const sectionTop = section.offsetTop - headerOffset;

        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });
      }
    }, 100);  // Delay by 100 milliseconds
  };

  // Handle sticky navigation and active tab highlighting
  const handleScroll = useCallback(() => {
    if (!navRef.current) return;

    const navInitialTop = navRef.current.offsetTop;
    const overviewSection = document.getElementById("aboutProject");

    // Check if overview section is still in view
    const overviewInView = overviewSection 
        ? window.scrollY < overviewSection.offsetTop - 160 
        : false;

    // Sticky navigation logic
    setIsSticky(window.scrollY >= navInitialTop && !overviewInView);

    const scrollPos = window.scrollY;
    let activeIndex = 0;

    propertyPageNavigtionValues.forEach((val, index) => {
        const section = document.getElementById(val.section);
        if (section) {
            const offsetTop = section.offsetTop - 160;  // Adjusted for header offset
            const sectionHeight = section.offsetHeight;

            // Check if section is within view
            if (scrollPos >= offsetTop && scrollPos < offsetTop + sectionHeight) {
                activeIndex = index;
            }
        }
    });

    // Update the active tab
    setValue(activeIndex);

}, [propertyPageNavigtionValues]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      ref={navRef}
      className={`propertyPageNavigationWrapper ${isSticky ? "sticky" : ""}`}
    >
      <div className="propertyPageNavigationContainer">
        <div className="tabsPage">
          {propertyPageNavigtionValues.map((val, index) => (
            <div
              key={index}
              className={`tabPage ${value === index ? "selected" : ""}`}
              style={tabStyles}
              onClick={() => handleChange(index)}
            >
              {val.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPageNavigation;
