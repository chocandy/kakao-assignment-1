"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createTodo } from "@/app/actions";

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function NewTodoPage() {
  const [state, formAction, pending] = useActionState(createTodo, null);
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? getTodayString();

  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <h1 className="text-[2rem] font-extrabold text-primary tracking-tight">
          Todo
        </h1>
      </header>

      <form action={formAction}>
        <input type="hidden" name="date" value={date} />

        <div className="mb-1.5">
          <div className="flex gap-2">
            <input
              name="title"
              type="text"
              placeholder="새 할 일을 입력하세요..."
              maxLength={100}
              autoComplete="off"
              autoFocus
              className="flex-1 h-12 px-4 border-[1.5px] border-border rounded-[10px] text-[0.95rem] text-text bg-surface outline-none placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(103,43,224,0.12)] transition-all"
            />
            <button
              type="submit"
              disabled={pending}
              className="h-12 px-[22px] bg-primary hover:bg-primary-light active:scale-[0.97] text-white rounded-[10px] text-[0.95rem] font-semibold whitespace-nowrap transition-all disabled:opacity-50"
            >
              {pending ? "추가 중..." : "추가"}
            </button>
          </div>
          {state?.error && (
            <p className="text-[0.82rem] text-danger mt-1.5 pl-1">
              {state.error}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Link
            href={`/todos?date=${date}`}
            className="text-[0.88rem] text-text-muted hover:text-text transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  );
}
