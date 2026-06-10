import { useState, useEffect } from 'react';
import { getTodayString } from './utils/date';
import WeekNavigator from './components/WeekNavigator';
import TodoInput from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';

const STORAGE_KEY = 'todo_app_data';

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(getTodayString);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore
    }
  }, [todos]);

  function addTodo(text) {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, date: currentDate },
    ]);
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function updateTodo(id, newText) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  }

  const filteredTodos = todos
    .filter((t) => t.date === currentDate)
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });

  return (
    <div className="w-full max-w-[560px]">
      <header className="mb-7">
        <h1 className="text-[2rem] font-extrabold text-primary tracking-tight">Todo</h1>
      </header>

      <WeekNavigator currentDate={currentDate} onSelectDate={setCurrentDate} todos={todos} />
      <TodoInput onAdd={addTodo} />
      <FilterTabs filter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />
    </div>
  );
}
