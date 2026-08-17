"""
database.py
Configures the SQLAlchemy engine, session factory, and declarative base.
The SQLite database file (tasks.db) is created automatically on first run
in the same directory as this file — no manual setup required.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite file lives alongside the backend code. "check_same_thread=False" is
# required because FastAPI can handle a single request across multiple
# threads, and SQLite's default driver restricts connections to one thread.
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Each instance of SessionLocal is an actual database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that our ORM models will inherit from.
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session and guarantees it is
    closed after the request finishes, even if an error is raised.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
