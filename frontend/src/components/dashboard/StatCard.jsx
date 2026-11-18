function StatCard({
  title,
  value,
  icon,
  color = "#D4AF37",
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#DCE8DE]
        bg-[#FFFFFF]
        p-6
        transition-all
        duration-300
        hover:border-[#D4AF37]
        hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-[#52705D]">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#14532D]">
            {value}
          </h2>

        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: color + "20",
            color: color,
          }}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;