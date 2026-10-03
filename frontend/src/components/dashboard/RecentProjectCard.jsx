import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function RecentProjectCard({
  projectId,
  title,
  budget,
  status,
}) {
  return (
    <Link
      to={`/projects/${projectId}`}
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
          className={`rounded-full px-4 py-2 text-sm capitalize ${
            status === "completed"
              ? "bg-blue-900/30 text-blue-300"
              : status === "in-progress"
                ? "bg-yellow-900/30 text-yellow-300"
                : "bg-[#1A3023] text-[#D4AF37]"
          }`}
        >
          {status?.replace("-", " ")}
        </span>

        <FaArrowRight
          className="text-[#C7D2CC]"
        />

      </div>
    </Link>
  );
}

export default RecentProjectCard;