import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


def _uuid() -> str:
    return str(uuid.uuid4())


class User(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    avatar_url: Optional[str] = None


class Submission(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    problem_id: str = Field(index=True)
    language: str
    code: str
    verdict: str
    score: Optional[int] = None
    max_score: Optional[int] = None
    passed: int
    total: int
    execution_time_ms: int
    breakdown: str = Field(default="{}")  # JSON-encoded dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SolvedProblem(SQLModel, table=True):
    user_id: str = Field(foreign_key="user.id", primary_key=True)
    problem_id: str = Field(primary_key=True)
    solved_at: datetime = Field(default_factory=datetime.utcnow)


class ProblemList(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ProblemListItem(SQLModel, table=True):
    list_id: str = Field(foreign_key="problemlist.id", primary_key=True)
    problem_id: str = Field(primary_key=True)


class RoadmapProgress(SQLModel, table=True):
    user_id: str = Field(foreign_key="user.id", primary_key=True)
    node_id: str = Field(primary_key=True)
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)
