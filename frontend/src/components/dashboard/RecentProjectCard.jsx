import { FaArrowRight } from "react-icons/fa";

function RecentProjectCard({
  title,
  budget,
  status,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-[#22362B]
        bg-[#102018]
        p-5
        transition-all
        duration-300
        hover:border-[#D4AF37]
      "
    >
      <div>
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#C7D2CC]">
          Budget : ₹{budget}
        </p>
      </div>

      <div className="flex items-center gap-5">

        <span
          className="
            rounded-full
            bg-[#1A3023]
            px-4
            py-2
            text-sm
            text-[#D4AF37]
          "
        >
          {status}
        </span>

        <FaArrowRight
          className="text-[#C7D2CC]"
        />

      </div>
    </div>
  );
}

export default RecentProjectCard;