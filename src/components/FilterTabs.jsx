const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행중' },
  { key: 'completed', label: '완료' },
];

export default function FilterTabs({ filter, onFilterChange }) {
  return (
    <div className="flex gap-1 bg-surface border border-border rounded-[10px] p-1 mb-4" role="tablist">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          onClick={() => onFilterChange(key)}
          className={`flex-1 h-9 rounded-[6px] text-[0.88rem] font-medium transition-all ${
            filter === key
              ? 'bg-primary text-white font-bold'
              : 'bg-transparent text-text-muted hover:bg-bg hover:text-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
