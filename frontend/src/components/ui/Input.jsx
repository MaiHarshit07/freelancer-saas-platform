function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-emerald-900
          bg-[#13251c]
          px-4
          py-3
          text-white
          placeholder:text-gray-500
          outline-none
          transition
          focus:border-emerald-500
        "
      />

    </div>
  );
}

export default Input;