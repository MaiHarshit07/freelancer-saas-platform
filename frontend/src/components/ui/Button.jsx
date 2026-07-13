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
        rounded-lg
        bg-[#D4AF37]
        px-5
        py-3
        text-sm
        font-semibold
        text-[#07140E]
        transition-all
        duration-200
        hover:bg-[#E6C766]
        active:scale-[0.98]
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