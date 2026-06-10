import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[0.92rem] text-text-muted">이 날의 할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2" aria-label="할 일 목록">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
