"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL!;

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function createTodo(
  _: unknown,
  formData: FormData
): Promise<{ error: string } | null> {
  const title = (formData.get("title") as string)?.trim();
  const date = formData.get("date") as string;
  if (!title) return { error: "제목을 입력해주세요." };

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, date }),
  });
  if (!res.ok) return { error: "Todo 생성에 실패했습니다." };

  revalidatePath("/todos");
  redirect(`/todos?date=${date}`);
}

export async function updateTodo(
  _: unknown,
  formData: FormData
): Promise<{ error: string } | null> {
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const completed = formData.get("completed") === "on";
  const date = formData.get("date") as string;

  if (!title) return { error: "제목을 입력해주세요." };

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed }),
  });
  if (!res.ok) return { error: "Todo 수정에 실패했습니다." };

  revalidatePath("/todos");
  redirect(`/todos?date=${date}`);
}

export async function toggleTodo(
  id: number,
  title: string,
  completed: boolean
): Promise<void> {
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: !completed }),
  });
  revalidatePath("/todos");
}

export async function deleteTodo(id: number): Promise<void> {
  await fetch(`${BACKEND_URL}/todos/${id}`, { method: "DELETE" });
  revalidatePath("/todos");
}
