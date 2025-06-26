import React from "react";

const PropertyWrapper = ({ children, id }) => {
  // console.log('Children:', children);
  return (
    <div className="propertyWrapper" id={id}>
      {children}
    </div>
  );
};

export default PropertyWrapper;
