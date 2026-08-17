"""
schemas.py
Pydantic (v2) schemas used for request validation and response serialization.
These are intentionally separate from the SQLAlchemy models in models.py so
that the API's public "shape" can evolve independently of the database schema.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

from models import PriorityEnum, StatusEnum


class TaskBase(BaseModel):
    """Fields shared by create and update payloads."""

    title: str
    description: Optional[str] = ""
    priority: PriorityEnum = PriorityEnum.MEDIUM

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, value: str) -> str:
        """Enforces the 'title is required and non-empty' rule server-side."""
        if not value or not value.strip():
            raise ValueError("Title must not be empty")
        return value.strip()


class TaskCreate(TaskBase):
    """Payload for POST /tasks. Status always starts as Pending, so it is
    intentionally not accepted here."""
    pass


class TaskUpdate(BaseModel):
    """
    Payload for PUT /tasks/{id}. All fields are optional so the client can
    update just the fields it wants to change (partial update).
    """

    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not value.strip():
            raise ValueError("Title must not be empty")
        return value.strip() if value is not None else value


class TaskResponse(TaskBase):
    """Shape of a task as returned by the API."""

    id: int
    status: StatusEnum
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Allows Pydantic to read data directly from SQLAlchemy ORM objects.
    model_config = ConfigDict(from_attributes=True)
