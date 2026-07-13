import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      login(res.data.user, res.data.token);

      console.log("Logged In");
    } catch (err) {
      console.error(
        "Login Failed:",
        err.response?.data || err.message || err
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#22362B] bg-[#16281F] p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#F5F7F5]">
          Welcome Back
        </h1>

        <p className="mt-3 text-sm text-[#C7D2CC]">
          Sign in to continue managing your freelance projects.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-[#D4AF37] transition hover:text-[#E6C766]"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit">
          Sign In
        </Button>
      </form>

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-[#22362B]" />
        <span className="px-4 text-sm text-[#C7D2CC]">
          OR
        </span>
        <div className="h-px flex-1 bg-[#22362B]" />
      </div>

      <p className="text-center text-sm text-[#C7D2CC]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#D4AF37] transition hover:text-[#E6C766]"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;