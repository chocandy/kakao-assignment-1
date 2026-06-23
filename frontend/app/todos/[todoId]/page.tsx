import { notFound } from "next/navigation";
import Link from "next/link";
import { getTodos } from "@/app/actions";
import EditTodoForm from "./EditTodoForm";

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default async function EditTodoPage({
  params,
  searchParams,
}: {
  params: Promise<{ todoId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { todoId } = await params;
  const { date = getTodayString() } = await searchParams;

  const todos = await getTodos();
  const todo = todos.find((t) => t.id === Number(todoId));
  if (!todo) notFound();

  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <h1 className="text-[2rem] font-extrabold text-primary tracking-tight">
          Todo
        </h1>
      </header>

      <EditTodoForm todo={todo} returnDate={date} />

      <div className="mt-6">
        <Link
          href={`/todos?date=${date}`}
          className="text-[0.88rem] text-text-muted hover:text-text transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
