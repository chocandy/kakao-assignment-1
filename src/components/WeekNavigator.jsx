import { getTodayString, shiftDate } from '../utils/date';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekStart(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + diff);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function WeekNavigator({ currentDate, onSelectDate, todos }) {
  const today = getTodayString();
  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => shiftDate(weekStart, i));

  function countForDate(date) {
    return todos.filter((t) => t.date === date).length;
  }

  return (
    <div className="bg-surface border border-border rounded-[16px] p-3 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectDate(shiftDate(weekStart, -7))}
          aria-label="이전 주"
          className="w-9 h-9 flex items-center justify-center border border-border rounded-[6px] text-text-muted text-xl hover:bg-primary-bg hover:text-primary hover:border-primary transition-colors"
        >
          ‹
        </button>

        <div className="flex gap-1">
          {weekDays.map((date) => {
            const d = new Date(date + 'T00:00:00');
            const dayName = DAY_NAMES[d.getDay()];
            const dayNum = d.getDate();
            const count = countForDate(date);
            const isSelected = date === currentDate;
            const isToday = date === today;

            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center w-10 py-1.5 rounded-[10px] transition-colors ${
                  isSelected
                    ? 'bg-primary text-white'
                    : isToday
                    ? 'bg-primary-bg text-primary'
                    : 'text-text-muted hover:bg-primary-bg hover:text-primary'
                }`}
              >
                <span className="text-xs">{dayName}</span>
                <span className="text-sm font-semibold">{dayNum}</span>
                <span className="text-xs opacity-80">{count}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSelectDate(shiftDate(weekStart, 7))}
          aria-label="다음 주"
          className="w-9 h-9 flex items-center justify-center border border-border rounded-[6px] text-text-muted text-xl hover:bg-primary-bg hover:text-primary hover:border-primary transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
