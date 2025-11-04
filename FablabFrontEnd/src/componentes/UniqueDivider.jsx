import "../styles/UniqueDivider.css"; 

export default function UniqueDivider({
  variant = "gradient",           
  thickness = 2,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`white-divider ${variant} ${className}`}
      style={{ "--thickness": `${thickness}px`, ...style }}
      aria-hidden="true"
    />
  );
}
