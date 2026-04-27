from typing import Generator
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./db.sqlite"

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,  # needed for SQLite under multi-threaded uvicorn
    },
    echo=False,
)


def init_db() -> None:
    """Create all tables. Called once on server startup."""
    SQLModel.metadata.create_all(engine)
    # Enable WAL mode for better concurrent read performance
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA journal_mode=WAL")


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
