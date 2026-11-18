import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

function ProjectCard({
    project,
    onDelete,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";

      case "in-progress":
        return "bg-yellow-100 text-yellow-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-[#F1F7F1] text-[#14532D]";
    }
  };

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
      {/* Header */}

      <div className="flex items-start justify-between gap-5">

        <div className="flex-1">

          <h2 className="text-xl font-semibold text-[#14532D]">
            {project.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#52705D]">
            {project.description}
          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>

      </div>

      {/* Budget */}

      <div className="mt-6">

        <p className="text-lg font-bold text-[#D4AF37]">
          ₹ {project.budget}
        </p>

      </div>

      {/* Skills */}

      <div className="mt-5 flex flex-wrap gap-2">

        {project.skills.map((skill) => (
          <span
            key={skill}
            className="
              rounded-full
              bg-[#F1F7F1]
              px-3
              py-1
              text-xs
              text-[#52705D]
            "
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Created Date */}

      <p className="mt-6 text-sm text-[#66816D]">
        Created{" "}
        {new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* Divider */}

      <div className="my-6 h-px bg-[#DCE8DE]" />

      {/* Actions */}

      <div className="flex items-center justify-end gap-6">

        <Link
          to={`/projects/edit/${project._id}`}
          className="flex items-center gap-2 text-sm text-[#52705D] transition hover:text-[#D4AF37]"
        >
          <FaEdit />
          Edit
        </Link>

        <Link
          to={`/projects/${project._id}`}
          className="flex items-center gap-2 text-sm text-[#52705D] transition hover:text-[#D4AF37]"
        >
          <FaEye />
          View
        </Link>

        <button
  onClick={() => onDelete(project._id)}
  className="flex items-center gap-2 text-sm text-red-700 transition hover:text-red-700"
>
  <FaTrash />
  Delete
</button>
      </div>

    </div>
  );
}

export default ProjectCard;