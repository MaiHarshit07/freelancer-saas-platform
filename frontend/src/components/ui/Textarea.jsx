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

      <label className="block text-sm font-medium text-[#C7D2CC]">
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
          border-[#22362B]
          bg-[#102018]
          px-4
          py-3
          text-white
          placeholder:text-[#7F8D85]
          outline-none
          transition
          focus:border-[#D4AF37]
        "
      />

    </div>
  );
}

export default Textarea;