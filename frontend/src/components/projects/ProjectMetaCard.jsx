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

          <p className="mt-1 capitalize text-white">
            {project.status}
          </p>
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
