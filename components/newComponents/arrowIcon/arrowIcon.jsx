import React from "react";

const CustomArrowIcon = ({ lineLength, strokeWidth }) => {
  const arrowHeadSize = 6; // Keep the arrowhead size fixed
  const lineStartX = 0; // Start point for the line on the x-axis
  const lineEndX = lineStartX + lineLength; // End point for the line on the x-axis
  const centerY = strokeWidth + arrowHeadSize; // Center Y coordinate for the line and arrowhead

  const arrowPoints = `M${lineEndX} ${centerY} l${
    -arrowHeadSize * 1.5
  } ${-arrowHeadSize} 
                       M${lineEndX} ${centerY} l${
    -arrowHeadSize * 1.5
  } ${arrowHeadSize}`; // Points to draw the arrowhead

  return (
    <svg
      width={lineEndX + arrowHeadSize}
      height={centerY * 2}
      viewBox={`0 0 ${lineEndX + arrowHeadSize} ${centerY * 2}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{ display: "block" }} // Ensure SVG does not take any additional space
    >
      {/* Line */}
      <line
        x1={lineStartX}
        y1={centerY}
        x2={lineEndX}
        y2={centerY}
        stroke='currentColor'
        strokeWidth={strokeWidth}
      />
      {/* Arrowhead */}
      <path
        d={arrowPoints}
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    </svg>
  );
};

export default CustomArrowIcon;
