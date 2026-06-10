# Todo App — React 마이그레이션

Vanilla JS로 작성한 Todo 앱을 React Function Component 구조로 마이그레이션한 과제입니다.

## 기술 스택

- React 19, Vite 8, Tailwind CSS 4, JavaScript

## 컴포넌트 구조

```
src/
├── components/
│   ├── WeekNavigator.jsx   # 주간 달력 날짜 선택
│   ├── TodoInput.jsx       # 입력창 + 추가 버튼
│   ├── TodoItem.jsx        # 개별 Todo (완료 · 수정 · 삭제)
│   ├── TodoList.jsx        # Todo 목록 + 빈 상태 메시지
│   └── FilterTabs.jsx      # 전체 / 진행중 / 완료 탭
├── utils/
│   └── date.js             # 날짜 유틸 함수
├── App.jsx                 # 루트 컴포넌트 (전체 상태 관리)
├── index.css               # Tailwind 진입점
└── main.jsx                # 앱 진입점
```

---

## 구현 기능

### 1. Todo CRUD

- 텍스트 입력 후 추가 버튼 또는 Enter 키로 Todo를 생성해요.
- 빈값 입력 시 Todo가 생성되지 않고 에러 메시지를 표시해요.
- 수정 버튼을 누르면 `prompt()` 없이 해당 항목이 인라인 입력창으로 전환돼요.
- Enter로 저장, Escape로 취소, 저장/취소 버튼도 제공해요.
- 완료 처리된 Todo는 텍스트에 취소선이 표시돼요.

**`isEditing` 상태 동작 방식**

`TodoItem.jsx`의 `isEditing`이 `false`이면 텍스트 + 수정/삭제 버튼이 표시되고, `true`로 바뀌면 같은 자리가 `<input>` + 저장/취소 버튼으로 자동 교체돼요. Vanilla JS에서는 `prompt()`로 팝업을 띄웠지만, React에서는 상태 하나로 UI가 전환돼요.

**`useState` 선언 위치와 역할**

| 위치 | 변수 | 관리하는 값 |
|---|---|---|
| `App.jsx` | `todos` | 전체 Todo 배열 |
| `App.jsx` | `filter` | `'all'` \| `'active'` \| `'completed'` |
| `App.jsx` | `currentDate` | 선택된 날짜 (`YYYY-MM-DD`) |
| `TodoItem.jsx` | `isEditing` | 인라인 수정 모드 여부 |
| `TodoItem.jsx` | `editText` | 수정 중인 텍스트 |
| `TodoInput.jsx` | `text` | 입력창 현재 텍스트 |
| `TodoInput.jsx` | `error` | 빈값 에러 표시 여부 |

---

### 2. 상태별 필터링

- 전체 / 진행중 / 완료 탭으로 원하는 Todo만 볼 수 있어요.
- 탭 전환 후 새 Todo를 추가해도 필터가 유지돼요.

**필터 상태가 바뀌면 목록이 어떻게 다시 그려지나요?**

`App.jsx`의 `filteredTodos`가 `todos`와 `filter` 상태를 기반으로 계산돼요. `filter`가 바뀌면 App이 리렌더링되면서 새로 걸러진 배열이 `TodoList`에 전달돼요. Vanilla JS에서는 `querySelectorAll`로 DOM을 직접 숨기고 보여줬지만, React에서는 보여줄 데이터 자체를 걸러서 넘기는 방식이에요.

---

### 3. 날짜별 Todo 관리 (주간 뷰)

- 주간 달력에서 날짜를 클릭해 이동하고, 선택된 날짜의 Todo만 표시돼요.
- 오늘 날짜는 파란 점으로 표시돼요.
- 이전/다음 주 화살표로 주 단위 이동이 가능해요.

**Todo에 날짜가 어떤 형태로 저장되나요?**

Todo 생성 시 `date: currentDate` 형태로 `"2026-06-10"` 같은 `YYYY-MM-DD` 문자열이 저장돼요. 화면에 표시할 때 `t.date === currentDate`로 비교해서 해당 날짜의 Todo만 필터링해요.

---

### 4. localStorage 연동

- Todo 변경사항은 항상 localStorage에 저장돼요.
- 새로고침 후에도 기존 데이터가 유지돼요.

**`useEffect` 의존성 배열**

```js
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}, [todos]);
```

의존성 배열에 `todos`가 들어있어요. `todos` 배열이 바뀔 때마다 저장이 실행되어야 하기 때문이에요. 배열이 비어있으면 최초 1회만 실행되고, `todos`를 넣어야 추가/수정/삭제 때마다 자동으로 저장돼요. Vanilla JS에서는 `addTodo`, `deleteTodo`, `updateTodoText` 함수마다 `localStorage.setItem()`을 직접 호출했지만, React에서는 `useEffect` 하나로 일괄 처리해요.
