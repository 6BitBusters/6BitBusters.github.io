import React from 'react';

interface XAxisProps {
  labels: string[]; 
}

const XAxis: React.FC<XAxisProps> = ({ labels }) => {
  return (
    <g className="x-axis">
      {labels.map((label, index) => (
        <text key={index} x={index * 100} y={0} textAnchor="middle">
          {label}
        </text>
      ))}
    </g>
  );
};

export default XAxis;
