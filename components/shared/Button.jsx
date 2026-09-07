import React from "react";
// import "./button.css";
import styles from "./Button.module.css"; // Adjust the path as necessary

function Button({ btnText = "Search", width, padding, fontWeight, otherStyles, onClick }) {
  return (
    <button
      className={styles.sharedSearchButton}
      /* Interpolating an omitted prop produced the literal string "undefined",
         which React then tried to set as a CSS value. Only pass what was given. */
      style={{
        ...(padding && { padding }),
        ...(width && { width }),
        ...(fontWeight && { fontWeight }),
        ...otherStyles,
      }}
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}

export default Button;
