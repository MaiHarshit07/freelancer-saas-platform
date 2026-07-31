function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="mb-10 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-[#9BA7A0]">
          {subtitle}
        </p>

      </div>

      {action}

    </div>
  );
}

export default PageHeader;