export default function ProjectMetaCard({
  project,
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
      <h3 className="mb-6 text-lg font-semibold text-white">
        Project Information
      </h3>

      <div className="space-y-5">

        <div>
          <p className="text-sm text-[#76837B]">
            Budget
          </p>

          <p className="mt-1 text-xl font-bold text-[#D4AF37]">
            ₹ {project.budget}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#76837B]">
            Status
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${
              project.status === "completed"
                ? "bg-blue-900/30 text-blue-300"
                : project.status === "in-progress"
                  ? "bg-yellow-900/30 text-yellow-300"
                  : "bg-emerald-900/30 text-emerald-300"
            }`}
          >
            {project.status?.replace("-", " ")}
          </span>
        </div>

        <div>
          <p className="text-sm text-[#76837B]">
            Created
          </p>

          <p className="mt-1 text-white">
            {new Date(
              project.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

      </div>
    </div>
  );
}
