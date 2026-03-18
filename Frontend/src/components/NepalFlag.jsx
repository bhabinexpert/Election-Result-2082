// ----- NepalFlag Component -----
// SVG rendering of Nepal's national flag

const NepalFlag = ({ size = 32, className = "" }) => {
  const w = size * 0.82;
  const h = size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={w}
      height={h}
      className={className}
    >
      {/* Bottom pennant */}
      <polygon
        points="5,0 95,52 5,52"
        fill="#DC143C"
        stroke="#003893"
        strokeWidth="4"
      />
      <polygon
        points="5,52 95,100 5,120"
        fill="#DC143C"
        stroke="#003893"
        strokeWidth="4"
      />
      {/* Crescent moon */}
      <circle cx="35" cy="25" r="12" fill="white" />
      <circle cx="39" cy="23" r="10" fill="#DC143C" />
      {/* Star */}
      <polygon
        points="35,75 37,81 43,81 38,85 40,91 35,87 30,91 32,85 27,81 33,81"
        fill="white"
      />
    </svg>
  );
};

export default NepalFlag;
