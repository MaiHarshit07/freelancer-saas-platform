function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#14532D]"
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="
          w-full
          rounded-lg
          border
          border-[#DCE8DE]
          bg-[#FFFFFF]
          px-4
          py-3
          text-[#14532D]
          outline-none
          transition-all
          duration-200
          focus:border-[#D4AF37]
          focus:ring-2
          focus:ring-[#D4AF37]/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;