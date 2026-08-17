"""
models.py
Defines the SQLAlchemy ORM model(s) that map Python objects to rows in the
SQLite database. This is the single source of truth for the database schema.
"""

import enum

from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func

from database import Base


class PriorityEnum(str, enum.Enum):
    """Allowed values for a task's priority. Stored as a string in SQLite."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class StatusEnum(str, enum.Enum):
    """Allowed values for a task's status. Stored as a string in SQLite."""
    PENDING = "Pending"
    COMPLETED = "Completed"


class Task(Base):
    """
    Represents a single task row in the 'tasks' table.

    created_at is set once, automatically, when the row is first inserted.
    updated_at is refreshed automatically by the database every time the
    row is updated (via onupdate), so callers never have to manage it by hand.
    """

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True, default="")
    priority = Column(Enum(PriorityEnum), nullable=False, default=PriorityEnum.MEDIUM)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.PENDING)

    # server_default/server_onupdate ensure the database itself stamps the
    # timestamp, so behavior is consistent regardless of which client wrote it.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
