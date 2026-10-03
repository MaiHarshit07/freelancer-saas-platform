export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  loadingText = "Working...",
  confirmClassName = "bg-red-600 text-white hover:bg-red-700",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-[#22362B]
          bg-[#102018]
          p-6
          shadow-2xl
        "
      >
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        <p className="mt-3 leading-7 text-[#9AA8A1]">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              rounded-xl
              border
              border-[#22362B]
              px-5
              py-2
              text-white
              transition
              hover:bg-[#16281F]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-5 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {isLoading ? loadingText : confirmText}
          </button>

        </div>
      </div>
    </div>
  );
}