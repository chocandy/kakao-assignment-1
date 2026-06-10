import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onUpdate(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.isComposing) handleSave();
    else if (e.key === 'Escape') handleCancel();
  }

  return (
    <li
      className={`flex items-center justify-between gap-3 border rounded-[10px] px-4 py-3.5 shadow-sm transition-all ${
        todo.completed
          ? 'bg-[#fafafa] border-border'
          : 'bg-surface border-border hover:shadow-[0_4px_16px_rgba(103,43,224,0.10)] hover:border-primary'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo.id)}
          title={todo.completed ? '완료 취소' : '완료로 표시'}
          className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-primary border-primary'
              : 'border-border hover:border-primary'
          }`}
        >
          {todo.completed && (
            <span className="text-[0.75rem] text-white font-bold leading-none">✓</span>
          )}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoFocus
            className="flex-1 h-8 px-2.5 border-[1.5px] border-primary rounded-[6px] text-[0.95rem] text-text outline-none bg-white shadow-[0_0_0_3px_rgba(103,43,224,0.10)] min-w-0"
          />
        ) : (
          <span
            className={`text-[0.95rem] word-break-all min-w-0 flex-1 ${
              todo.completed ? 'line-through text-text-muted' : 'text-text'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-1.5 shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="h-[30px] px-3 bg-success text-white rounded-[6px] text-[0.8rem] font-medium hover:opacity-90 transition-opacity"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="h-[30px] px-3 bg-bg text-text-muted border border-border rounded-[6px] text-[0.8rem] font-medium hover:bg-border hover:text-text transition-colors"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="h-[30px] px-3 bg-primary-bg text-primary rounded-[6px] text-[0.8rem] font-medium hover:bg-primary hover:text-white transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="h-[30px] px-3 bg-danger-light text-danger rounded-[6px] text-[0.8rem] font-medium hover:bg-danger hover:text-white transition-colors"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
}
