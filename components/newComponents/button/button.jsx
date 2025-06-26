import React from "react";
// import "./button.css";

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
      className='search-button'
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
