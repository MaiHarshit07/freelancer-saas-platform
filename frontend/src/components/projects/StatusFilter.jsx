export default function StatusFilter({
  currentStatus,
  onStatusChange,
}) {
  const filters = [
    "all",
    "open",
    "in-progress",
    "completed",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`
            rounded-full
            px-5
            py-2
            text-sm
            capitalize
            transition

            ${
              currentStatus === status
                ? "bg-[#D4AF37] text-[#07140E]"
                : "bg-[#16281F] text-[#C7D2CC] hover:bg-[#22362B]"
            }
          `}
        >
          {status.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}
