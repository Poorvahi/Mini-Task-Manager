"""
crud.py
All direct database operations (Create, Read, Update, Delete) live here,
kept separate from the HTTP routing logic in main.py. Each function takes
a SQLAlchemy Session and returns plain SQLAlchemy model instances.
"""

from typing import List, Optional

from sqlalchemy.orm import Session

import models
import schemas


def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Fetch a single task by its primary key, or None if it doesn't exist."""
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(db: Session) -> List[models.Task]:
    """
    Fetch all tasks, most recently created first.
    Filtering and searching are handled on the frontend per the spec, so this
    stays a simple full fetch.
    """
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()


def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    """Insert a new task row. Status always defaults to Pending on creation."""
    db_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        status=models.StatusEnum.PENDING,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate) -> Optional[models.Task]:
    """
    Apply a partial update to an existing task. Only fields explicitly set
    on the incoming payload are changed; everything else is left untouched.
    Returns None if no task with that id exists.
    """
    db_task = get_task(db, task_id)
    if db_task is None:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task


def complete_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Convenience shortcut used by the one-click 'Complete' button."""
    db_task = get_task(db, task_id)
    if db_task is None:
        return None
    db_task.status = models.StatusEnum.COMPLETED
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:
    """Delete a task by id. Returns True if a row was deleted, False if not found."""
    db_task = get_task(db, task_id)
    if db_task is None:
        return False
    db.delete(db_task)
    db.commit()
    return True
