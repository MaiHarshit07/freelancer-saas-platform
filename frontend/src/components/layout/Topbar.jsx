import { FaBell, FaUserCircle } from "react-icons/fa";

function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#22362B] bg-[#07140E] px-8  backdrop-blur-xl">

      <div>
        <h1 className="text-2xl font-semibold text-[#F5F7F5]">
          Dashboard
        </h1>

        <p className="text-sm text-[#C7D2CC]">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <button
          className="
            rounded-xl
            border
            border-[#22362B]
            p-3
            text-[#C7D2CC]
            transition
            hover:border-[#D4AF37]
            hover:text-[#D4AF37]
          "
        >
          <FaBell />
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            className="text-4xl text-[#D4AF37]"
          />

          <div>

            <h3 className="font-medium text-[#F5F7F5]">
              Harshit
            </h3>

            <p className="text-sm text-[#C7D2CC]">
              Freelancer
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;