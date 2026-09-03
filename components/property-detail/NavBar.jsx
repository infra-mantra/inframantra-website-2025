import React, { useEffect, useState } from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `nbs` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means nbs["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import nbs from "./NavBar.module.css";

const PropertySectionNavbar = () => {
  const [activeTab, setActiveTab] = useState("Highlights");

  const tabs = [
    "Overview",
    "About Project",
    "Highlights",
    "Amenities",
    "Locality",
    "Plan & Pricing",
    "EMI Calculator",
    "About Developer",
    "FAQ's",
  ];

  const handleClick = (tab) => {
    setActiveTab(tab);

    const section = document.getElementById(tab);
    const navbar = document.querySelector(".section-navbar");

    if (section && navbar) {
      const yOffset = -navbar.offsetHeight;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  // 🔥 Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      let currentTab = activeTab;

      tabs.forEach((tab) => {
        const section = document.getElementById(tab);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentTab = tab;
          }
        }
      });

      if (currentTab !== activeTab) {
        setActiveTab(currentTab);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, tabs]);

  return (
    <div className={nbs["section-navbar"]}>
      <ul className={nbs["section-tabs"]}>
        {tabs.map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertySectionNavbar;
