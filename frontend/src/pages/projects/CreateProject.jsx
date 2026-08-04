import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/dashboard/PageHeader";

import {
  Button,
  Input,
  Textarea,
  FormCard,
} from "../../components/ui";

import { createProject } from "../../services/projectService";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await createProject(payload);

      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Project"
        subtitle="Post a new project for freelancers."
      />

      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Title"
            name="title"
            placeholder="Enter project title..."
            value={formData.title}
            onChange={handleChange}
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Describe your project..."
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            label="Budget (₹)"
            type="number"
            name="budget"
            placeholder="Enter project budget..."
            value={formData.budget}
            onChange={handleChange}
          />

          <Input
            label="Required Skills"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
          />

          <div className="flex justify-end">
            <Button type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}

export default CreateProject;