import PageHeader from "../../components/dashboard/PageHeader";
import Button from "../../components/ui/Button";

function Projects() {
  return (
    <div>

      <PageHeader
        title="Projects"
        subtitle="Manage all your projects."
        action={
          <Button>
            + Create Project
          </Button>
        }
      />

      <div className="rounded-2xl border border-[#22362B] bg-[#102018] p-8">

        <p className="text-[#9BA7A0]">
          Projects will appear here.
        </p>

      </div>

    </div>
  );
}

export default Projects;