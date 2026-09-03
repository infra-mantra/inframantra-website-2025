import React from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `dev` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means dev["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import dev from "./Developer.module.css";

function developer({ propertyData }) {
  return (
    <>
      <div className="pd" style={{ display: "flex" }}>
        <div className={`card ${dev["card-w"]}`}>
          <h2 className="heading-developer-name"> {propertyData.developer.name}</h2>
          <div className="boldline1"></div>
          <p className={`${dev["p-text-style"]} p-text`}>{propertyData.developer.description}</p>
        </div>
      </div>
    </>
  );
}

export default developer;
