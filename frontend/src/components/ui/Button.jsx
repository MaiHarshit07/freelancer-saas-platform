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
        text-black
        transition
        hover:scale-105
      "
    >
      {children}
    </button>
  );
}

export default Button;