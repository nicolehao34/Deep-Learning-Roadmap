"""
Code evaluator: writes user code to a temp directory and runs pytest
with JSON reporting. Supports two modes:
  - run:    public tests only (fast feedback)
  - submit: all tests + point scoring from problem.json
"""

import json
import os
import shutil
import sys
import tempfile
import subprocess
from pathlib import Path
from typing import Literal

PROBLEMS_DIR = Path(__file__).parent / "problems"


def _problem_dir(problem_id: str) -> Path:
    return PROBLEMS_DIR / problem_id


def public_tests_exist(problem_id: str) -> bool:
    d = _problem_dir(problem_id)
    return (d / "public_tests.py").exists()


def private_eval_exists(problem_id: str) -> bool:
    d = _problem_dir(problem_id)
    return (d / "eval_script.py").exists()


def problem_exists(problem_id: str, mode: Literal["run", "submit", "all"] = "all") -> bool:
    if mode == "run":
        return public_tests_exist(problem_id)
    if mode == "submit":
        return public_tests_exist(problem_id) and private_eval_exists(problem_id)
    return public_tests_exist(problem_id) and private_eval_exists(problem_id)
def _load_problem_meta(problem_id: str) -> dict:
    meta_path = _problem_dir(problem_id) / "problem.json"
    with open(meta_path) as f:
        return json.load(f)


def _run_pytest(test_file: Path, solution_path: Path, timeout: int) -> dict:
    """
    Copy test file + solution into a fresh temp dir, run pytest with
    --json-report, and return the parsed report dict.
    """
    tmpdir = Path(tempfile.mkdtemp())
    report_path = tmpdir / "report.json"

    try:
        # Write user solution
        shutil.copy(solution_path, tmpdir / "solution.py")
        # Copy test file
        shutil.copy(test_file, tmpdir / test_file.name)

        result = subprocess.run(
            [
                sys.executable, "-m", "pytest",
                test_file.name,
                "--json-report",
                f"--json-report-file={report_path}",
                "--tb=short",
                "-q",
                "--no-header",
            ],
            cwd=tmpdir,
            capture_output=True,
            text=True,
            timeout=timeout,
        )

        if report_path.exists():
            with open(report_path) as f:
                report = json.load(f)
        else:
            # pytest crashed before writing the report
            report = {
                "tests": [],
                "summary": {"total": 0, "passed": 0, "failed": 0, "error": 1},
            }

        report["_stdout"] = result.stdout
        report["_stderr"] = result.stderr
        report["_returncode"] = result.returncode
        return report

    except subprocess.TimeoutExpired:
        return {
            "tests": [],
            "summary": {"total": 0, "passed": 0, "failed": 0},
            "_stdout": "",
            "_stderr": "Time limit exceeded.",
            "_returncode": -1,
            "_timeout": True,
        }
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def _parse_test_results(report: dict, test_points: dict | None = None) -> list[dict]:
    """
    Turn the pytest-json-report `tests` list into a flat list of results,
    each with: name, class_name, passed, error, duration, points_earned, points_possible.
    """
    results = []
    for t in report.get("tests", []):
        node_id = t.get("nodeid", "")
        # nodeid looks like: public_tests.py::ClassName::method_name
        parts = node_id.split("::")
        class_name = parts[1] if len(parts) >= 3 else ""
        test_name = parts[-1] if parts else node_id
        outcome = t.get("outcome", "unknown")
        passed = outcome == "passed"

        # Error message from short traceback
        error = None
        if not passed:
            call = t.get("call", {})
            error = call.get("longrepr", "") or t.get("longrepr", "")
            if isinstance(error, list):
                error = "\n".join(str(x) for x in error)

        # Point lookup uses "ClassName::method_name" key
        lookup_key = f"{class_name}::{test_name}"
        points_possible = (test_points or {}).get(lookup_key, 0)
        points_earned = points_possible if passed else 0

        results.append({
            "id": node_id,
            "name": test_name,
            "class_name": class_name,
            "passed": passed,
            "error": error,
            "duration": round(t.get("duration", 0) * 1000),  # ms
            "points_earned": points_earned,
            "points_possible": points_possible,
        })
    return results


def evaluate_run(problem_id: str, code: str) -> dict:
    """
    Run public tests only. Returns per-test pass/fail with stdout.
    """
    prob_dir = _problem_dir(problem_id)
    meta = _load_problem_meta(problem_id)
    timeout = meta.get("timeout", 60)

    # Write code to a temp file so _run_pytest can copy it
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as f:
        f.write(code)
        solution_tmp = Path(f.name)

    try:
        report = _run_pytest(prob_dir / "public_tests.py", solution_tmp, timeout)
    finally:
        solution_tmp.unlink(missing_ok=True)

    if report.get("_timeout"):
        return {
            "verdict": "Time Limit Exceeded",
            "tests": [],
            "stdout": "",
            "stderr": "Your code exceeded the time limit.",
            "execution_time_ms": timeout * 1000,
        }

    results = _parse_test_results(report)
    passed = sum(1 for r in results if r["passed"])
    total = len(results)

    return {
        "verdict": "Accepted" if passed == total and total > 0 else "Wrong Answer",
        "tests": results,
        "stdout": report.get("_stdout", ""),
        "stderr": report.get("_stderr", ""),
        "passed": passed,
        "total": total,
        "execution_time_ms": int(report.get("duration", 0) * 1000),
    }


def evaluate_submit(problem_id: str, code: str) -> dict:
    """
    Run private eval script (all tests) and return scored results.
    """
    prob_dir = _problem_dir(problem_id)
    meta = _load_problem_meta(problem_id)
    timeout = meta.get("timeout", 60)
    test_points: dict = meta.get("testPoints", {})
    point_breakdown: dict = meta.get("pointBreakdown", {})

    with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as f:
        f.write(code)
        solution_tmp = Path(f.name)

    try:
        report = _run_pytest(prob_dir / "eval_script.py", solution_tmp, timeout)
    finally:
        solution_tmp.unlink(missing_ok=True)

    if report.get("_timeout"):
        return {
            "verdict": "Time Limit Exceeded",
            "score": 0,
            "tests": [],
            "breakdown": {cat: {"earned": 0, "total": pts} for cat, pts in point_breakdown.items()},
            "stdout": "",
            "stderr": "Your code exceeded the time limit.",
            "execution_time_ms": timeout * 1000,
        }

    results = _parse_test_results(report, test_points)

    # Aggregate score
    total_earned = sum(r["points_earned"] for r in results)
    total_possible = sum(r["points_possible"] for r in results)

    # Category breakdown — derive from class name prefixes
    category_map = {
        "TestNumericalAccuracy": "Numerical Accuracy",
        "TestMaskingAccuracy": "Masking",
        "TestDropoutImplementation": "Dropout",
        "TestEdgeCases": "Edge Cases",
    }
    breakdown: dict[str, dict] = {
        cat: {"earned": 0, "total": pts} for cat, pts in point_breakdown.items()
    }
    for r in results:
        cat_name = category_map.get(r["class_name"])
        if cat_name and cat_name in breakdown:
            breakdown[cat_name]["earned"] += r["points_earned"]

    passed = sum(1 for r in results if r["passed"])
    total = len(results)
    verdict = "Accepted" if passed == total and total > 0 else "Wrong Answer"
    if report.get("_returncode") not in (0, 1):
        verdict = "Runtime Error"

    return {
        "verdict": verdict,
        "score": total_earned,
        "max_score": total_possible,
        "tests": results,
        "breakdown": breakdown,
        "stdout": report.get("_stdout", ""),
        "stderr": report.get("_stderr", ""),
        "passed": passed,
        "total": total,
        "execution_time_ms": int(report.get("duration", 0) * 1000),
    }
