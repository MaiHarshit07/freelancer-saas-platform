function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-xl
        bg-emerald-600
        px-5
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-emerald-500
        hover:shadow-lg
        hover:shadow-emerald-500/20
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;