"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <h1 className="text-[2rem] font-extrabold text-primary tracking-tight">
          Todo
        </h1>
      </header>

      <div className="bg-danger-light border border-danger rounded-[10px] px-6 py-8 text-center">
        <p className="text-danger font-semibold mb-1">문제가 발생했습니다</p>
        <p className="text-[0.88rem] text-text-muted mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={unstable_retry}
            className="h-10 px-5 bg-danger text-white rounded-[8px] text-[0.88rem] font-medium hover:opacity-90 transition-opacity"
          >
            다시 시도
          </button>
          <Link
            href="/todos"
            className="h-10 px-5 bg-surface border border-border text-text-muted rounded-[8px] text-[0.88rem] font-medium hover:bg-bg transition-colors flex items-center"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
