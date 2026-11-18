function Button({
  children,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        rounded-xl
        bg-[#D4AF37]
        px-5
        py-3
        font-semibold
        text-[#14532D]
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#E6C766]
        hover:shadow-md
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#166534]
      "
    >
      {children}
    </button>
  );
}

export default Button;