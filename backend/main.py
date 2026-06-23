import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, text, inspect
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=True)  # YYYY-MM-DD


def migrate():
    """기존 DB에 date 컬럼이 없으면 추가."""
    insp = inspect(engine)
    if "todos" in insp.get_table_names():
        cols = [c["name"] for c in insp.get_columns("todos")]
        if "date" not in cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE todos ADD COLUMN date TEXT"))
                conn.commit()


migrate()
Base.metadata.create_all(bind=engine)


class TodoCreate(BaseModel):
    title: str
    completed: bool = False
    date: Optional[str] = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: Optional[str] = None

    model_config = {"from_attributes": True}


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(date: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Todo)
    if date:
        query = query.filter(Todo.date == date)
    return query.all()


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
