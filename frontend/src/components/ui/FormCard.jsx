function FormCard({ children }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#22362B]
        bg-[#102018]
        p-8
        shadow-lg
      "
    >
      {children}
    </div>
  );
}

export default FormCard;