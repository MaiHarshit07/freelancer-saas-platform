export default function ProjectInfoCard({
  title,
  children,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#22362B]
        bg-[#102018]
        p-6
      "
    >
      <h3 className="mb-4 text-lg font-semibold text-white">
        {title}
      </h3>

      {children}
    </div>
  );
}

