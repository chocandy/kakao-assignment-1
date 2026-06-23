"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateTodo, type Todo } from "@/app/actions";

export default function EditTodoForm({
  todo,
  returnDate,
}: {
  todo: Todo;
  returnDate: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateTodo, null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") router.push(`/todos?date=${returnDate}`);
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={todo.id} />
      <input type="hidden" name="date" value={returnDate} />

      <li className="flex items-center justify-between gap-3 border border-primary rounded-[10px] px-4 py-3.5 shadow-sm bg-surface list-none">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 shrink-0 rounded-full border-2 border-border flex items-center justify-center" />
          <input
            name="title"
            type="text"
            defaultValue={todo.title}
            maxLength={100}
            autoFocus
            onKeyDown={handleKeyDown}
            className="flex-1 h-8 px-2.5 border-[1.5px] border-primary rounded-[6px] text-[0.95rem] text-text outline-none bg-white shadow-[0_0_0_3px_rgba(103,43,224,0.10)] min-w-0"
          />
        </div>

        <div className="flex gap-1.5 shrink-0">
          <button
            type="submit"
            disabled={pending}
            className="h-[30px] px-3 bg-success text-white rounded-[6px] text-[0.8rem] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
          <Link
            href={`/todos?date=${returnDate}`}
            className="h-[30px] px-3 bg-bg text-text-muted border border-border rounded-[6px] text-[0.8rem] font-medium hover:bg-border hover:text-text transition-colors flex items-center"
          >
            취소
          </Link>
        </div>
      </li>

      <div className="mt-4 flex items-center gap-2">
        <input
          id="completed"
          name="completed"
          type="checkbox"
          defaultChecked={todo.completed}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="completed" className="text-[0.88rem] text-text-muted">
          완료됨
        </label>
      </div>

      {state?.error && (
        <p className="text-[0.82rem] text-danger mt-3 pl-1">{state.error}</p>
      )}
    </form>
  );
}
