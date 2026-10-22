import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdMenu } from "react-icons/io";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useShortlist } from "../shared/shortlist/shortlistStore.js";

// The drawer's contents (links, icons, social buttons) load only when the menu
// is opened — they are not needed for the first paint. See MobileMenuDrawer.jsx.
const loadDrawer = () => import("./MobileMenuDrawer.jsx");
const MobileMenuDrawer = dynamic(loadDrawer, { ssr: false });

const MobileMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const shortlistCount = useShortlist().length;

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
  };

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (path) => {
    return router.pathname === `/${path}` ? "#E4A01D" : "#00000";
  };

  const handleNavigation = useCallback(
    (path) => {
      let finalPath = `/${path}`;
      if (finalPath.includes("/page/page")) {
        finalPath = finalPath.replace("/page/page", "/page");
      }

      if (router.pathname !== finalPath) {
        router.push(finalPath);
      }
      setOpen(false); // Always close drawer after navigation
    },
    [router]
  );

  return (
    <div>
      {/* Touching / hovering the icon starts fetching the drawer, so it is
          usually ready by the time the tap (click) opens it. */}
      <IoMdMenu
        size={30}
        onClick={toggleDrawer(true)}
        onTouchStart={loadDrawer}
        onMouseEnter={loadDrawer}
        style={{ cursor: "pointer" }}
      />
      {/* The drawer is drawn straight into <body>: the header it is opened from
          has a blur filter and clips its overflow, which trapped a drawer drawn
          inside it to the header's own height (so on the home page on phones it
          never appeared). */}
      {open &&
        createPortal(
          <div
            onClick={toggleDrawer(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 100000, // above the chat assistant (99999)
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "80%",
                maxWidth: "400px",
                height: "100%",
                backgroundColor: "#fff",
              }}
            >
              <MobileMenuDrawer
                toggleDrawer={toggleDrawer}
                handleNavigation={handleNavigation}
                isActive={isActive}
                shortlistCount={shortlistCount}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MobileMenu;
