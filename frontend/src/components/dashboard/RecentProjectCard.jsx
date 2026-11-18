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
        border-[#DCE8DE]
        bg-[#FFFFFF]
        p-5
        transition-all
        duration-300
        hover:border-[#D4AF37]
      "
    >
      <div>
        <h3 className="text-lg font-semibold text-[#14532D]">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#52705D]">
          Budget : ₹{budget}
        </p>
      </div>

      <div className="flex items-center gap-5">

        <span
          className={`rounded-full px-4 py-2 text-sm capitalize ${
            status === "completed"
              ? "bg-blue-100 text-blue-700"
              : status === "in-progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-[#EAF4EC] text-[#D4AF37]"
          }`}
        >
          {status?.replace("-", " ")}
        </span>

        <FaArrowRight
          className="text-[#52705D]"
        />

      </div>
    </Link>
  );
}

export default RecentProjectCard;