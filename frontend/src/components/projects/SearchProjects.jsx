import { FaSearch } from "react-icons/fa";

function SearchProjects({ value, onChange }) {
  return (
    <div className="relative w-full">
      <FaSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[#76837B]
        "
      />

      <input
        type="text"
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-[#22362B]
          bg-[#102018]
          py-3
          pl-12
          pr-4
          text-white
          outline-none
          transition
          placeholder:text-[#76837B]
          focus:border-[#D4AF37]
        "
      />
    </div>
  );
}

export default SearchProjects;
