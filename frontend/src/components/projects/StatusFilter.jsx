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
                ? "bg-[#D4AF37] text-[#14532D]"
                : "bg-[#F1F7F1] text-[#52705D] hover:bg-[#DCE8DE]"
            }
          `}
        >
          {status.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}
