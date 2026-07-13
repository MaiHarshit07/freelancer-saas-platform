function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#F5F7F5]"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full
          rounded-lg
          border
          border-[#22362B]
          bg-[#102018]
          px-4
          py-3
          text-[#F5F7F5]
          placeholder:text-[#6B7C73]
          outline-none
          transition-all
          duration-200
          focus:border-[#D4AF37]
          focus:ring-2
          focus:ring-[#D4AF37]/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      />
    </div>
  );
}

export default Input;