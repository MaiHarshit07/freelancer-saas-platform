import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#22362B] bg-[#07140E]/90 backdrop-blur-xl">

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#D4AF37] transition hover:text-[#E6C766]"
        >
          Freelancer Platform
        </Link>

        <div className="hidden items-center gap-10 md:flex">

          <Link
            to="/"
            className="text-[#C7D2CC] transition duration-300 hover:text-[#D4AF37]"
          >
            Home
          </Link>

          <Link
            to="/"
            className="text-[#C7D2CC] transition duration-300 hover:text-[#D4AF37]"
          >
            Projects
          </Link>

          <Link
            to="/"
            className="text-[#C7D2CC] transition duration-300 hover:text-[#D4AF37]"
          >
            Features
          </Link>

          <Link
            to="/"
            className="text-[#C7D2CC] transition duration-300 hover:text-[#D4AF37]"
          >
            About
          </Link>

        </div>

        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="rounded-xl border border-[#2A4434] px-5 py-2.5 text-[#E5ECE8] transition duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#D4AF37] px-5 py-2.5 font-medium text-[#07140E] transition duration-300 hover:bg-[#E6C766] hover:shadow-lg hover:shadow-[#D4AF37]/20"
          >
            Get Started
          </Link>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;