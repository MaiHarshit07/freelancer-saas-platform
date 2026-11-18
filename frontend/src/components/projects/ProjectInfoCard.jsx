export default function ProjectInfoCard({
  title,
  children,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#DCE8DE]
        bg-[#FFFFFF]
        p-6
      "
    >
      <h3 className="mb-4 text-lg font-semibold text-[#14532D]">
        {title}
      </h3>

      {children}
    </div>
  );
}

