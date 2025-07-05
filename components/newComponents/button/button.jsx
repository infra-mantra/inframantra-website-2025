import React from "react";
// import "./button.css";
import styles from './button.module.css'; // Adjust the path as necessary

function Button({
  btnText = "Search",
  width,
  padding,
  fontWeight,
  otherStyles,
  onClick,
}) {
  return (
    <button
      className={styles.searchbutton}
      style={{
        padding: `${padding}`,
        width: `${width}`,
        fontWeight: `${fontWeight}`,
        ...otherStyles,
      }}
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}

export default Button;
