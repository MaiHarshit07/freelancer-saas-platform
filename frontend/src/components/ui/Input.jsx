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

      <label className="block text-sm font-medium text-[#52705D]">
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
          border-[#DCE8DE]
          bg-[#FFFFFF]
          px-4
          py-3
          text-[#14532D]
          placeholder:text-[#66816D]
          outline-none
          transition
          focus:border-[#D4AF37]
        "
      />

    </div>
  );
}

export default Input;