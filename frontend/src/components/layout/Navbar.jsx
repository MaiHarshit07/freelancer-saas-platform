import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE8DE] bg-white backdrop-blur-xl">


      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="whitespace-nowrap text-lg font-bold tracking-tight text-[#D4AF37] transition hover:text-[#E6C766] sm:text-2xl"
        >
          Freelancer Platform
        </Link>

        <div className="hidden items-center gap-4 lg:flex lg:gap-8">

          <Link
            to="/"
            className="text-[#52705D] transition duration-300 hover:text-[#D4AF37]"
          >
            Home
          </Link>

          <Link
            to="/projects"
            className="text-[#52705D] transition duration-300 hover:text-[#D4AF37]"
          >
            Projects
          </Link>

          <Link
            to="/projects"
            className="text-[#52705D] transition duration-300 hover:text-[#D4AF37]"
          >
            Features
          </Link>

          <Link
            to="/"
            className="text-[#52705D] transition duration-300 hover:text-[#D4AF37]"
          >
            About
          </Link>

        </div>

        <div className="flex items-center gap-2 sm:gap-4">

          <Link
            to="/login"
            className="whitespace-nowrap rounded-xl border border-[#DCE8DE] px-3 py-2.5 text-[#315B3F] transition duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] sm:px-5"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="whitespace-nowrap rounded-xl bg-[#D4AF37] px-3 py-2.5 font-medium text-[#14532D] transition duration-300 hover:bg-[#E6C766] hover:shadow-lg hover:shadow-[#D4AF37]/20 sm:px-5"
          >
            Get Started
          </Link>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;