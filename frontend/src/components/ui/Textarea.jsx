function Textarea({
  label,
  placeholder,
  value,
  onChange,
  name,
  rows = 5,
}) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-medium text-[#52705D]">
        {label}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          resize-none
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

export default Textarea;