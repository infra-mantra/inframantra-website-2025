import React from "react";
import EmiCalculator from "./emiCalculator";
import PropertyWrapper from "../../propertyLeftSection/propertyPageSections/propertyWrapper";

function PropertyEMICalculator({ initialPrincipal }) {
  return (
    <PropertyWrapper
        id='emiCalculator'
      >
        <div className='aboutProjectWrapper'>
          <h2 className='aboutProjectHeader'>EMI Calculator</h2>
          <EmiCalculator initialPrincipal={initialPrincipal} />
        </div>
    </PropertyWrapper>
  );
}

export default PropertyEMICalculator;
