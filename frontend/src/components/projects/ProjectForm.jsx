import { useState } from "react";

import {
  Button,
  Input,
  Textarea,
  FormCard,
} from "../ui";

function ProjectForm({
  initialValues,
  onSubmit,
  buttonText,
  disabled = false,
}) {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    budget: initialValues.budget || "",
    skills: initialValues.skills?.join(", ") || "",
  });

  const handleChange = (e) => {
    if (disabled) return;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disabled) return;

    onSubmit({
      ...formData,
      budget: Number(formData.budget),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  return (
    <FormCard>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Input
          label="Project Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter project title..."
          disabled={disabled}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your project..."
          disabled={disabled}
        />

        <Input
          label="Budget (₹)"
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Enter budget..."
          disabled={disabled}
        />

        <Input
          label="Required Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          disabled={disabled}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </FormCard>
  );
}

export default ProjectForm;