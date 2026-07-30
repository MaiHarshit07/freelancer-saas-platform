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
        border-[#22362B]
        bg-[#102018]
        p-6
        transition-all
        duration-300
        hover:border-[#D4AF37]
        hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-[#C7D2CC]">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
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