import Link from "next/link";
import { getTodos, deleteTodo, toggleTodo } from "@/app/actions";
import WeekNavigator from "./WeekNavigator";

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "active", label: "진행중" },
  { key: "completed", label: "완료" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string }>;
}) {
  const { filter = "all", date = getTodayString() } = await searchParams;
  const currentFilter = (
    FILTERS.some((f) => f.key === filter) ? filter : "all"
  ) as FilterKey;

  const allTodos = await getTodos();

  const countsByDate = allTodos.reduce<Record<string, number>>((acc, t) => {
    if (t.date) acc[t.date] = (acc[t.date] ?? 0) + 1;
    return acc;
  }, {});

  const todosForDate = allTodos.filter((t) => t.date === date);
  const filtered = todosForDate.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <h1 className="text-[2rem] font-extrabold text-primary tracking-tight">
          Todo
        </h1>
      </header>

      <WeekNavigator
        currentDate={date}
        currentFilter={currentFilter}
        countsByDate={countsByDate}
      />

      <div className="mb-1.5">
        <Link
          href={`/todos/new?date=${date}`}
          className="flex items-center justify-center h-12 px-[22px] bg-primary hover:bg-primary-light text-white rounded-[10px] text-[0.95rem] font-semibold transition-all w-full"
        >
          + 새 할 일 추가
        </Link>
      </div>

      <div
        className="flex gap-1 bg-surface border border-border rounded-[10px] p-1 mb-4 mt-4"
        role="tablist"
      >
        {FILTERS.map(({ key, label }) => (
          <Link
            key={key}
            href={`/todos?filter=${key}&date=${date}`}
            role="tab"
            className={`flex-1 h-9 rounded-[6px] text-[0.88rem] font-medium transition-all flex items-center justify-center ${
              currentFilter === key
                ? "bg-primary text-white font-bold"
                : "bg-transparent text-text-muted hover:bg-bg hover:text-text"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[0.92rem] text-text-muted">
            이 날의 할 일이 없습니다.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="할 일 목록">
          {filtered.map((todo) => {
            const toggleWithData = toggleTodo.bind(
              null,
              todo.id,
              todo.title,
              todo.completed
            );
            const deleteWithId = deleteTodo.bind(null, todo.id);

            return (
              <li
                key={todo.id}
                className={`flex items-center justify-between gap-3 border rounded-[10px] px-4 py-3.5 shadow-sm transition-all ${
                  todo.completed
                    ? "bg-[#fafafa] border-border"
                    : "bg-surface border-border hover:shadow-[0_4px_16px_rgba(103,43,224,0.10)] hover:border-primary"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <form action={toggleWithData}>
                    <button
                      type="submit"
                      title={todo.completed ? "완료 취소" : "완료로 표시"}
                      className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {todo.completed && (
                        <span className="text-[0.75rem] text-white font-bold leading-none">
                          ✓
                        </span>
                      )}
                    </button>
                  </form>
                  <span
                    className={`text-[0.95rem] min-w-0 flex-1 truncate ${
                      todo.completed
                        ? "line-through text-text-muted"
                        : "text-text"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <Link
                    href={`/todos/${todo.id}?date=${date}`}
                    className="h-[30px] px-3 bg-primary-bg text-primary rounded-[6px] text-[0.8rem] font-medium hover:bg-primary hover:text-white transition-colors flex items-center"
                  >
                    수정
                  </Link>
                  <form action={deleteWithId}>
                    <button
                      type="submit"
                      className="h-[30px] px-3 bg-danger-light text-danger rounded-[6px] text-[0.8rem] font-medium hover:bg-danger hover:text-white transition-colors"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
