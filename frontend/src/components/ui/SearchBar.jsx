import { FaSearch } from "react-icons/fa";

function SearchBar({
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full max-w-md">

      <FaSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66816D]"
      />

      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-[#DCE8DE]
          bg-[#FFFFFF]
          py-3
          pl-11
          pr-4
          text-[#14532D]
          outline-none
          transition
          focus:border-[#D4AF37]
        "
      />

    </div>
  );
}

export default SearchBar;