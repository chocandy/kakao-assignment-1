# Todo App — Next.js + FastAPI

Next.js App Router와 FastAPI로 구성된 Todo 앱입니다.

## 프로젝트 구조

```
kakao-assignment-1/
├── frontend/   # Next.js (App Router, TypeScript, Tailwind)
└── backend/    # FastAPI
```

## 기술 스택

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, ESLint
- **Backend**: FastAPI, Uvicorn, SQLAlchemy, Pydantic

---

## 실행 방법

### Frontend

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

브라우저에서 http://localhost:8000 접속  
API 문서: http://localhost:8000/docs

---

## API

| Method | Path | 응답 |
|--------|------|------|
| GET | `/` | `{"message": "Hello World"}` |
