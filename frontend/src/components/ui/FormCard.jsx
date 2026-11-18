function FormCard({ children }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#DCE8DE]
        bg-[#FFFFFF]
        p-8
        shadow-lg
      "
    >
      {children}
    </div>
  );
}

export default FormCard;