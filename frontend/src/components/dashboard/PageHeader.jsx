function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="mb-10 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold text-[#14532D]">
          {title}
        </h1>

        <p className="mt-2 text-[#52705D]">
          {subtitle}
        </p>

      </div>

      {action}

    </div>
  );
}

export default PageHeader;