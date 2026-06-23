export default function Loading() {
  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <div className="h-9 w-16 bg-primary-bg rounded-[8px] animate-pulse" />
      </header>

      <div className="h-12 bg-primary-bg rounded-[10px] animate-pulse mb-4" />

      <div className="h-11 bg-surface border border-border rounded-[10px] animate-pulse mb-4" />

      <ul className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="flex items-center gap-3 border border-border rounded-[10px] px-4 py-3.5 bg-surface"
          >
            <div className="w-6 h-6 rounded-full bg-primary-bg animate-pulse shrink-0" />
            <div className="flex-1 h-4 bg-primary-bg rounded animate-pulse" />
            <div className="flex gap-1.5">
              <div className="h-[30px] w-10 bg-primary-bg rounded-[6px] animate-pulse" />
              <div className="h-[30px] w-10 bg-danger-light rounded-[6px] animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
