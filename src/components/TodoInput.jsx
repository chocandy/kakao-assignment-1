import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  function handleAdd() {
    if (!text.trim()) {
      setError(true);
      return;
    }
    onAdd(text.trim());
    setText('');
    setError(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.isComposing) handleAdd();
  }

  function handleChange(e) {
    setText(e.target.value);
    if (e.target.value.trim()) setError(false);
  }

  return (
    <div className="mb-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="새 할 일을 입력하세요..."
          maxLength={100}
          autoComplete="off"
          className="flex-1 h-12 px-4 border-[1.5px] border-border rounded-[10px] text-[0.95rem] text-text bg-surface outline-none placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(103,43,224,0.12)] transition-all"
        />
        <button
          onClick={handleAdd}
          className="h-12 px-[22px] bg-primary hover:bg-primary-light active:scale-[0.97] text-white rounded-[10px] text-[0.95rem] font-semibold whitespace-nowrap transition-all"
        >
          추가
        </button>
      </div>
      {error && (
        <p className="text-[0.82rem] text-danger mt-1.5 pl-1">할 일을 입력해주세요.</p>
      )}
    </div>
  );
}
