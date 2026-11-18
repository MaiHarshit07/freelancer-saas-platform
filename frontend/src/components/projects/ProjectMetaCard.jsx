export default function ProjectMetaCard({
  project,
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
      <h3 className="mb-6 text-lg font-semibold text-[#14532D]">
        Project Information
      </h3>

      <div className="space-y-5">

        <div>
          <p className="text-sm text-[#66816D]">
            Budget
          </p>

          <p className="mt-1 text-xl font-bold text-[#D4AF37]">
            ₹ {project.budget}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#66816D]">
            Status
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${
              project.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : project.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {project.status?.replace("-", " ")}
          </span>
        </div>

        <div>
          <p className="text-sm text-[#66816D]">
            Created
          </p>

          <p className="mt-1 text-[#14532D]">
            {new Date(
              project.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

      </div>
    </div>
  );
}
