"""
FastAPI evaluation server for Deep Learning Roadmap.

Endpoints:
  POST /api/run     – run public tests, return per-test pass/fail
  POST /api/submit  – run private eval script, return score breakdown
  GET  /api/health  – liveness check
  /api/auth/*       – register, login, refresh, logout, me
  /api/users/me/*   – submissions, solved, lists
"""

import json
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import uvicorn
from sqlmodel import Session

from auth_utils import get_optional_user
from database import get_session, init_db
from evaluator import evaluate_run, evaluate_submit, problem_exists
from models import Submission, User
from routers import auth, users

app = FastAPI(title="DL Roadmap Evaluator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)

MAX_CODE_LENGTH = 50_000


@app.on_event("startup")
def on_startup():
    init_db()


class EvalRequest(BaseModel):
    problem_id: str
    code: str
    language: str = "python"

    @field_validator("code")
    @classmethod
    def code_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("code must not be empty")
        if len(v) > MAX_CODE_LENGTH:
            raise ValueError(f"code exceeds {MAX_CODE_LENGTH} character limit")
        return v

    @field_validator("language")
    @classmethod
    def language_supported(cls, v: str) -> str:
        if v != "python":
            raise ValueError("only Python is supported for evaluation")
        return v


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/run")
def run_code(req: EvalRequest):
    if not problem_exists(req.problem_id, mode="run"):
        raise HTTPException(
            status_code=404,
            detail=f"No evaluation available for problem '{req.problem_id}'.",
        )
    return evaluate_run(req.problem_id, req.code)


@app.post("/api/submit")
def submit_code(
    req: EvalRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    session: Session = Depends(get_session),
):
    if not problem_exists(req.problem_id, mode="submit"):
        raise HTTPException(
            status_code=404,
            detail=f"No evaluation available for problem '{req.problem_id}'.",
        )

    result = evaluate_submit(req.problem_id, req.code)

    if current_user:
        sub = Submission(
            user_id=current_user.id,
            problem_id=req.problem_id,
            language=req.language,
            code=req.code,
            verdict=result["verdict"],
            score=result.get("score"),
            max_score=result.get("max_score"),
            passed=result["passed"],
            total=result["total"],
            execution_time_ms=result["execution_time_ms"],
            breakdown=json.dumps(result.get("breakdown", {})),
        )
        session.add(sub)
        session.commit()

    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
