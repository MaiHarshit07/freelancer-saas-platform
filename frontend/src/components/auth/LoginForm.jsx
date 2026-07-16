import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

// ================================ //
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#22362B] bg-[#102018] p-8 shadow-xl">
      <h1 className="mb-2 text-3xl font-bold text-[#F5F7F5]">Welcome Back</h1>

      <p className="mb-8 text-[#C7D2CC]">
        Login to continue your freelance journey.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
