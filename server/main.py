"""
FastAPI evaluation server for Deep Learning Roadmap.

Endpoints:
  POST /api/run     – run public tests, return per-test pass/fail
  POST /api/submit  – run private eval script, return score breakdown
  GET  /api/health  – liveness check
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import uvicorn

from evaluator import evaluate_run, evaluate_submit, problem_exists

app = FastAPI(title="DL Roadmap Evaluator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_CODE_LENGTH = 50_000  # characters


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
    """
    Run public test suite against user code.
    Returns per-test pass/fail results and stdout.
    """
    if not problem_exists(req.problem_id):
        raise HTTPException(
            status_code=404,
            detail=f"No evaluation available for problem '{req.problem_id}'. "
                   "Public tests have not been set up for this problem yet.",
        )

    result = evaluate_run(req.problem_id, req.code)
    return result


@app.post("/api/submit")
def submit_code(req: EvalRequest):
    """
    Run private eval script against user code.
    Returns score breakdown and per-test results.
    """
    if not problem_exists(req.problem_id):
        raise HTTPException(
            status_code=404,
            detail=f"No evaluation available for problem '{req.problem_id}'. "
                   "This problem has not been set up for grading yet.",
        )

    result = evaluate_submit(req.problem_id, req.code)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
