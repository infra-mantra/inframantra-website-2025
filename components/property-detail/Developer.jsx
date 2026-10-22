import React, { useEffect, useRef, useState } from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `dev` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means dev["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import dev from "./Developer.module.css";

function Developer({ propertyData }) {
  const developer = propertyData?.developer || {};
  const [expanded, setExpanded] = useState(false);

  const description = developer.description || "";

  // Show "Read more" only when the text really runs past the 4 clamped lines
  // (measured, so short texts on wide screens get no button).
  const textRef = useRef(null);
  const [isLong, setIsLong] = useState(false);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      if (expanded) return;
      setIsLong(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [description, expanded]);

  return (
    <>
      <div className="pd" style={{ display: "flex" }}>
        <div className={`card ${dev["card-w"]} ${dev["dev-card"]}`}>
          <div className={dev["dev-head"]}>
            <div className={dev["dev-identity"]}>
              {developer.developerImg && (
                <div className={dev["dev-logo"]}>
                  <img src={developer.developerImg} alt={`${developer.name} logo`} loading="lazy" />
                </div>
              )}
              <div className={dev["dev-title"]}>
                <span className={dev["dev-eyebrow"]}>About the developer</span>
                <h2 className="heading-developer-name">{developer.name}</h2>
              </div>
            </div>
          </div>

          <div className="boldline1"></div>

          <p
            ref={textRef}
            className={`${dev["p-text-style"]} p-text ${expanded ? "" : dev["is-clamped"]}`}
          >
            {description}
          </p>
          {isLong && (
            <button
              type="button"
              className={dev["dev-more"]}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Developer;
