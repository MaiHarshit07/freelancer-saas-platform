import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          Freelancer Platform
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link className="text-gray-600 hover:text-black transition" to="/">
            Home
          </Link>

          <Link className="text-gray-600 hover:text-black transition" to="/">
            Projects
          </Link>

          <Link className="text-gray-600 hover:text-black transition" to="/">
            Features
          </Link>

          <Link className="text-gray-600 hover:text-black transition" to="/">
            About
          </Link>
        </div>

    
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;