import { FaSearch } from "react-icons/fa";

function SearchBar({
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full max-w-md">

      <FaSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7F8D85]"
      />

      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-[#22362B]
          bg-[#102018]
          py-3
          pl-11
          pr-4
          text-white
          outline-none
          transition
          focus:border-[#D4AF37]
        "
      />

    </div>
  );
}

export default SearchBar;