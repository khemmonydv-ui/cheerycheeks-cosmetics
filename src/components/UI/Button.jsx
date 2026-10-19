import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  disabled = false,
  onClick,
}) {
  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? "button--full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;