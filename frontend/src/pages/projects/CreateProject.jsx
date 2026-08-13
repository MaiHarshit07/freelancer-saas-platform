import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/dashboard/PageHeader";
import ProjectForm from "../../components/projects/ProjectForm";

import { createProject } from "../../services/projectService";

function CreateProject() {
  const navigate = useNavigate();

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);

      navigate("/projects");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Project"
        subtitle="Post a new project for freelancers."
      />

      <ProjectForm
        initialValues={{}}
        onSubmit={handleCreateProject}
        buttonText="Create Project"
      />
    </div>
  );
}

export default CreateProject;