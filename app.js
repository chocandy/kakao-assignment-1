// ===== 상수 =====
const STORAGE_KEY = 'todo_app_data'; // 로컬스토리지에서 사용할 키

// ===== 상태 =====
let todoList = [];          // 전체 Todo 배열
let currentFilter = 'all'; // 현재 선택된 필터: 'all' | 'active' | 'completed'
let currentDate = getTodayString(); // 현재 보고 있는 날짜 (YYYY-MM-DD)

// ===== DOM 요소 참조 =====
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const errorMsg = document.getElementById('errorMsg');
const todoListEl = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const currentDateDisplay = document.getElementById('currentDateDisplay');
const todayBadge = document.getElementById('todayBadge');
const prevDayBtn = document.getElementById('prevDayBtn');
const nextDayBtn = document.getElementById('nextDayBtn');
const filterTabs = document.querySelectorAll('.filter-tab');

// ===== 날짜 유틸리티 =====

// 오늘 날짜를 YYYY-MM-DD 형식 문자열로 반환
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 형식을 한국어 날짜 표시로 변환 (예: 2026년 6월 3일 (수))
function formatDateKo(dateStr) {
  // 로컬 시간 기준으로 파싱하기 위해 T00:00:00 추가
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// 주어진 날짜에서 n일을 더하거나 뺀 날짜를 YYYY-MM-DD 형식으로 반환
function shiftDate(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== 로컬스토리지 =====

// 현재 todoList를 JSON으로 변환해 로컬스토리지에 저장
// setItem이 예외를 던지는 경우(쿼터 초과, 보안 제한 등)를 잡아 데이터 유실 방지
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
  } catch (e) {
    console.warn('로컬스토리지 저장 실패:', e);
  }
}

// 로컬스토리지에서 JSON을 불러와 todoList에 복원
// JSON.parse 실패나 배열이 아닌 값이 저장된 경우 빈 배열로 안전하게 초기화
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 배열임을 확인한 뒤에만 적용 (잘못된 형식의 데이터 방어)
      todoList = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.warn('로컬스토리지 불러오기 실패:', e);
    todoList = [];
  }
}

// ===== Todo CRUD =====

// 새로운 Todo 항목을 생성하고 현재 날짜에 저장
function addTodo(text) {
  const newTodo = {
    id: Date.now(),        // 고유 ID로 타임스탬프 사용
    text: text.trim(),
    completed: false,
    date: currentDate,     // Todo 생성 시점의 날짜를 함께 저장
  };
  todoList.push(newTodo);
  saveToStorage();
  // 저장 후 실제로 로컬스토리지에 반영됐는지 검증
  verifyStorage();
  renderTodoList();
}

// 저장된 항목 수와 현재 in-memory 항목 수가 일치하는지 확인
function verifyStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.warn('저장 검증 실패: 로컬스토리지에 데이터가 없습니다.');
      return;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length !== todoList.length) {
      console.warn('저장 검증 실패: 저장된 항목 수가 일치하지 않습니다.', {
        inMemory: todoList.length,
        inStorage: Array.isArray(parsed) ? parsed.length : 'invalid',
      });
    }
  } catch (e) {
    console.warn('저장 검증 중 오류:', e);
  }
}

// 특정 id의 Todo를 목록에서 제거
function deleteTodo(id) {
  todoList = todoList.filter((todo) => todo.id !== id);
  saveToStorage();
  renderTodoList();
}

// 특정 id의 Todo 완료 상태를 토글 (완료 ↔ 진행중)
function toggleTodoCompleted(id) {
  const todo = todoList.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveToStorage();
    renderTodoList();
  }
}

// 특정 id의 Todo 텍스트를 수정
function updateTodoText(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return; // 빈 값이면 수정하지 않음
  const todo = todoList.find((todo) => todo.id === id);
  if (todo) {
    todo.text = trimmed;
    saveToStorage();
    renderTodoList();
  }
}

// ===== 필터링 =====

// 현재 날짜 + 현재 필터 조건에 맞는 Todo 배열을 반환
function getFilteredTodos() {
  // 1단계: 현재 보고 있는 날짜의 Todo만 추출
  const todosForDate = todoList.filter((todo) => todo.date === currentDate);

  // 2단계: 탭 필터 적용
  if (currentFilter === 'active') {
    return todosForDate.filter((todo) => !todo.completed);
  }
  if (currentFilter === 'completed') {
    return todosForDate.filter((todo) => todo.completed);
  }
  return todosForDate; // 'all': 필터 없이 전체 반환
}

// ===== 보안: XSS 방지 =====

// 사용자 입력 텍스트를 HTML로 삽입할 때 특수문자를 이스케이프
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ===== 렌더링 =====

// 날짜 표시 영역 갱신 (날짜 텍스트 + 오늘 뱃지)
function renderDateDisplay() {
  currentDateDisplay.textContent = formatDateKo(currentDate);

  // 현재 보고 있는 날짜가 오늘이면 '오늘' 뱃지 표시
  if (currentDate === getTodayString()) {
    todayBadge.classList.add('visible');
  } else {
    todayBadge.classList.remove('visible');
  }
}

// Todo 목록 전체를 다시 그림
function renderTodoList() {
  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    // 표시할 항목이 없으면 빈 상태 메시지 표시
    todoListEl.innerHTML = '';
    emptyState.classList.add('visible');
    return;
  }

  emptyState.classList.remove('visible');

  // 각 Todo를 <li> 요소로 변환
  todoListEl.innerHTML = filtered
    .map((todo) => createTodoItemHtml(todo))
    .join('');

  // 렌더링 후 버튼 이벤트 연결
  attachTodoItemEvents();
}

// Todo 항목 하나의 HTML 문자열을 생성
function createTodoItemHtml(todo) {
  return `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <div class="todo-content">
        <!-- 완료 토글 버튼 -->
        <button class="complete-btn" data-id="${todo.id}" title="${todo.completed ? '완료 취소' : '완료로 표시'}">
          <span class="checkmark">${todo.completed ? '✓' : ''}</span>
        </button>
        <!-- 할 일 텍스트 -->
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <div class="todo-actions">
        <button class="edit-btn" data-id="${todo.id}">수정</button>
        <button class="delete-btn" data-id="${todo.id}">삭제</button>
      </div>
    </li>
  `;
}

// 렌더링된 Todo 항목들에 이벤트를 연결
function attachTodoItemEvents() {
  // 완료 토글 버튼
  todoListEl.querySelectorAll('.complete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleTodoCompleted(Number(btn.dataset.id));
    });
  });

  // 수정 버튼: 해당 항목을 인라인 수정 모드로 전환
  todoListEl.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      startInlineEdit(Number(btn.dataset.id));
    });
  });

  // 삭제 버튼
  todoListEl.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTodo(Number(btn.dataset.id));
    });
  });
}

// 특정 항목을 인라인 수정 모드로 전환
function startInlineEdit(id) {
  const todo = todoList.find((t) => t.id === id);
  if (!todo) return;

  const itemEl = todoListEl.querySelector(`[data-id="${id}"]`);
  if (!itemEl) return;

  const contentEl = itemEl.querySelector('.todo-content');
  const actionsEl = itemEl.querySelector('.todo-actions');

  // 텍스트 영역을 input으로 교체
  contentEl.innerHTML = `
    <input type="text" class="edit-input" value="${escapeHtml(todo.text)}" maxlength="100" />
  `;

  // 액션 영역을 저장/취소 버튼으로 교체
  actionsEl.innerHTML = `
    <button class="save-btn" data-id="${id}">저장</button>
    <button class="cancel-btn" data-id="${id}">취소</button>
  `;

  const editInput = contentEl.querySelector('.edit-input');
  editInput.focus();
  editInput.select(); // 기존 텍스트 전체 선택

  // 저장 버튼 클릭
  actionsEl.querySelector('.save-btn').addEventListener('click', () => {
    updateTodoText(id, editInput.value);
  });

  // 취소 버튼 클릭 시 원래 목록으로 복원
  actionsEl.querySelector('.cancel-btn').addEventListener('click', () => {
    renderTodoList();
  });

  // 키보드 단축키: Enter = 저장, Escape = 취소
  // isComposing: IME 조합 중일 때는 Enter를 무시
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      updateTodoText(id, editInput.value);
    } else if (e.key === 'Escape') {
      renderTodoList();
    }
  });
}

// ===== 이벤트 등록 =====

// 할 일 추가 처리 (버튼 클릭 / Enter 키)
function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    // 빈 값 입력 시 에러 메시지 표시
    errorMsg.classList.add('visible');
    todoInput.focus();
    return;
  }

  errorMsg.classList.remove('visible');
  addTodo(text);
  todoInput.value = '';
  todoInput.focus();
}

// 추가 버튼 클릭
addBtn.addEventListener('click', handleAddTodo);

// 입력창에서 Enter 키 입력
// isComposing: 한국어 등 IME가 문자를 조합 중일 때는 true → 조합 완료 전에 실행하지 않음
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    handleAddTodo();
  }
});

// 타이핑 시작 시 에러 메시지 숨김
todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) {
    errorMsg.classList.remove('visible');
  }
});

// 이전 날짜 버튼
prevDayBtn.addEventListener('click', () => {
  currentDate = shiftDate(currentDate, -1);
  renderDateDisplay();
  renderTodoList();
});

// 다음 날짜 버튼
nextDayBtn.addEventListener('click', () => {
  currentDate = shiftDate(currentDate, 1);
  renderDateDisplay();
  renderTodoList();
});

// 필터 탭 클릭: 선택된 탭에 active 클래스 부여 후 목록 갱신
filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderTodoList();
  });
});

// ===== 앱 초기화 =====
(function init() {
  loadFromStorage();     // 저장된 데이터 불러오기
  renderDateDisplay();   // 날짜 표시
  renderTodoList();      // Todo 목록 표시
})();
