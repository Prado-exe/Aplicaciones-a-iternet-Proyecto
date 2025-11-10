import "../styles/UniqueDivider.css";

export default function UniqueDivider({
  variant = "gold",
  thickness = 2,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`unique-divider ${variant} ${className}`}
      style={{ "--thickness": `${thickness}px`, ...style }}
      aria-hidden="true"
    />
  );
}
