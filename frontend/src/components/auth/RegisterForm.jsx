import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#22362B] bg-[#16281F] p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#F5F7F5]">
          Create Account
        </h1>

        <p className="mt-3 text-sm text-[#C7D2CC]">
          Join our freelancer platform and start collaborating.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#F5F7F5]">
            Role
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#22362B] bg-[#102018] px-4 py-3 text-[#F5F7F5] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        <Button type="submit">
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[#C7D2CC]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#D4AF37] hover:text-[#E6C766]"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;