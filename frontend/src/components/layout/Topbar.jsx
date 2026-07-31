import { FaBell } from "react-icons/fa";

import SearchBar from "../ui/SearchBar";

function Topbar() {
  return (
    <div
      className="
        flex
        h-16
        items-center
        justify-between
        gap-6
        border-b
        border-[#22362B]
        bg-[#07140E]/90
        px-8
        backdrop-blur-xl
      "
    >
      {/* Search */}

      <div className="flex-1">
    <SearchBar placeholder="Search projects..." />
</div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button
          className="
            rounded-xl
            bg-[#102018]
            p-3
            text-[#C7D2CC]
            transition
            hover:border
            hover:border-[#D4AF37]
          "
        >
          <FaBell />
        </button>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#D4AF37]
            font-bold
            text-black
          "
        >
          H
        </div>

      </div>

    </div>
  );
}

export default Topbar;