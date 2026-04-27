import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from auth_utils import get_current_user
from database import get_session
from models import ProblemList, ProblemListItem, SolvedProblem, Submission, User

router = APIRouter(prefix="/api/users/me", tags=["users"])


# ── Submissions ────────────────────────────────────────────────────────────────

@router.get("/submissions")
def list_submissions(
    problem_id: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    q = select(Submission).where(Submission.user_id == user.id)
    if problem_id:
        q = q.where(Submission.problem_id == problem_id)
    q = q.order_by(Submission.timestamp.desc()).offset(offset).limit(limit)
    rows = session.exec(q).all()
    return [
        {
            **row.model_dump(),
            "breakdown": json.loads(row.breakdown),
        }
        for row in rows
    ]


# ── Solved problems ────────────────────────────────────────────────────────────

@router.get("/solved")
def list_solved(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = session.exec(select(SolvedProblem).where(SolvedProblem.user_id == user.id)).all()
    return [r.problem_id for r in rows]


@router.post("/solved/{problem_id}", status_code=200)
def mark_solved(
    problem_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    row = SolvedProblem(user_id=user.id, problem_id=problem_id)
    session.add(row)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()  # already exists — idempotent
    return {"problem_id": problem_id, "solved": True}


@router.delete("/solved/{problem_id}", status_code=200)
def unmark_solved(
    problem_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    row = session.get(SolvedProblem, (user.id, problem_id))
    if row:
        session.delete(row)
        session.commit()
    return {"problem_id": problem_id, "solved": False}


# ── Custom lists ───────────────────────────────────────────────────────────────

class CreateListBody(BaseModel):
    name: str


class AddItemBody(BaseModel):
    problem_id: str


@router.get("/lists")
def list_lists(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lists = session.exec(select(ProblemList).where(ProblemList.user_id == user.id)).all()
    result = []
    for lst in lists:
        items = session.exec(
            select(ProblemListItem).where(ProblemListItem.list_id == lst.id)
        ).all()
        result.append({
            **lst.model_dump(),
            "items": [i.problem_id for i in items],
        })
    return result


@router.post("/lists", status_code=201)
def create_list(
    body: CreateListBody,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lst = ProblemList(user_id=user.id, name=body.name)
    session.add(lst)
    session.commit()
    session.refresh(lst)
    return {**lst.model_dump(), "items": []}


@router.post("/lists/{list_id}/items", status_code=200)
def add_list_item(
    list_id: str,
    body: AddItemBody,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lst = session.get(ProblemList, list_id)
    if not lst or lst.user_id != user.id:
        raise HTTPException(status_code=404, detail="List not found")
    item = ProblemListItem(list_id=list_id, problem_id=body.problem_id)
    session.add(item)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
    return {"list_id": list_id, "problem_id": body.problem_id}


@router.delete("/lists/{list_id}/items/{problem_id}", status_code=200)
def remove_list_item(
    list_id: str,
    problem_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lst = session.get(ProblemList, list_id)
    if not lst or lst.user_id != user.id:
        raise HTTPException(status_code=404, detail="List not found")
    item = session.get(ProblemListItem, (list_id, problem_id))
    if item:
        session.delete(item)
        session.commit()
    return {"list_id": list_id, "problem_id": problem_id, "removed": True}


@router.delete("/lists/{list_id}", status_code=200)
def delete_list(
    list_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lst = session.get(ProblemList, list_id)
    if not lst or lst.user_id != user.id:
        raise HTTPException(status_code=404, detail="List not found")
    items = session.exec(select(ProblemListItem).where(ProblemListItem.list_id == list_id)).all()
    for item in items:
        session.delete(item)
    session.delete(lst)
    session.commit()
    return {"list_id": list_id, "deleted": True}
