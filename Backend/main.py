"""
main.py
FastAPI application entry point. Defines HTTP routes and wires them to the
crud.py data-access layer. Run with:
    uvicorn main:app --reload
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import engine, get_db

# Creates the tasks.db SQLite file and the 'tasks' table on first run.
# Safe to call on every startup: it does nothing if the table already exists.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API", version="1.0.0")

# Allow the Vite dev server (React frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
def read_root():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "Task Manager API"}


@app.get("/tasks", response_model=list[schemas.TaskResponse], tags=["tasks"])
def list_tasks(db: Session = Depends(get_db)):
    """Return every task in the database."""
    return crud.get_tasks(db)


@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse, tags=["tasks"])
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Return a single task by id, or 404 if it doesn't exist."""
    db_task = crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return db_task


@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED, tags=["tasks"])
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task. Pydantic validates title (non-empty) and priority
    (must be Low/Medium/High) before this function body even runs; invalid
    payloads automatically get a 422 response with a descriptive error.
    """
    return crud.create_task(db, task)


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse, tags=["tasks"])
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """Update any subset of fields on an existing task."""
    db_task = crud.update_task(db, task_id, task_update)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return db_task


@app.patch("/tasks/{task_id}/complete", response_model=schemas.TaskResponse, tags=["tasks"])
def complete_task(task_id: int, db: Session = Depends(get_db)):
    """One-click endpoint to mark a task as Completed."""
    db_task = crud.complete_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return db_task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Permanently delete a task."""
    deleted = crud.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return None
