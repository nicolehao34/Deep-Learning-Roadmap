import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { ArrowLeft, Play, Send, X, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { problems, type Problem } from '@/data/problems-data'
import { categoryColors } from '@/lib/mindmap-layout'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'description' | 'editorial' | 'solutions' | 'submissions'
type Language = 'python' | 'javascript' | 'typescript'
type RunState = 'idle' | 'running' | 'done'
type Verdict = 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded'

interface TestResult {
  id: string
  name: string
  class_name: string
  passed: boolean
  error: string | null
  duration: number        // ms
  points_earned: number
  points_possible: number
}

interface RunResponse {
  verdict: Verdict
  tests: TestResult[]
  stdout: string
  stderr: string
  passed: number
  total: number
  execution_time_ms: number
}

interface ScoreBreakdownEntry {
  earned: number
  total: number
}

interface SubmitResponse extends RunResponse {
  score: number
  max_score: number
  breakdown: Record<string, ScoreBreakdownEntry>
}

interface Submission {
  id: string
  problemId: string
  language: Language
  code: string
  timestamp: number
  verdict: Verdict
  score?: number
  max_score?: number
  passed: number
  total: number
  execution_time_ms: number
  breakdown?: Record<string, ScoreBreakdownEntry>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'dl-problem-submissions'

const DIFFICULTY_COLORS: Record<Problem['difficulty'], string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}

const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
}

const MONACO_LANGUAGE: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
}

const STARTER_CODE: Record<Language, string> = {
  python: `import numpy as np


def solution():
    # TODO: implement your solution
    pass


if __name__ == "__main__":
    solution()
`,
  javascript: `function solution() {
    // TODO: implement your solution
}

solution();
`,
  typescript: `function solution(): void {
    // TODO: implement your solution
}

solution();
`,
}

// Fallback mock output for problems without a backend evaluator
const MOCK_OUTPUT: Record<string, string> = {
  'neural-networks':
    'Epoch   1/100 | Loss: 2.3026\nEpoch  50/100 | Loss: 0.4821\nEpoch 100/100 | Loss: 0.0142\n\nFinal training accuracy: 97.3%',
  perceptron: 'Converged in 7 steps. Final weights: [0.60, -0.40]',
  optimization: 'SGD: 0.1823 | Momentum: 0.0941 | Adam: 0.0312',
  regularization: 'Best λ=0.1 | val_loss: 0.289',
  transformers: 'Attention shape: (1, 8, 512, 512). Test passed.',
  'vision-language': 'Patch embeddings: (196, 768). Top-1: 81.4%',
  'self-supervised': 'Contrastive loss: 2.1 → 0.43. Probe accuracy: 74.2%',
  'graph-networks': 'GCN accuracy: 81.5% on Cora.',
  training: 'Epoch 10 | train_loss=0.412 val_loss=0.487',
  advanced: 'Generating: "The transformer architecture enables..."',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveSubmissions(subs: Submission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function apiRun(problemId: string, code: string, language: string): Promise<RunResponse> {
  const res = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem_id: problemId, code, language }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Server error ${res.status}`)
  }
  return res.json()
}

async function apiSubmit(problemId: string, code: string, language: string): Promise<SubmitResponse> {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem_id: problemId, code, language }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Server error ${res.status}`)
  }
  return res.json()
}

// ─── Output panel state ───────────────────────────────────────────────────────

type OutputMode = 'mock' | 'run' | 'submit'

interface OutputState {
  mode: OutputMode
  runResult?: RunResponse
  submitResult?: SubmitResponse
  mockText?: string
  error?: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Problem['difficulty'] }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[difficulty]}`}>
      {difficulty}
    </span>
  )
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const colors: Record<Verdict, string> = {
    Accepted: 'bg-green-100 text-green-700',
    'Wrong Answer': 'bg-red-100 text-red-700',
    'Runtime Error': 'bg-orange-100 text-orange-700',
    'Time Limit Exceeded': 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[verdict]}`}>
      {verdict}
    </span>
  )
}

function TestRow({ test }: { test: TestResult }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`rounded border text-xs ${test.passed ? 'border-[#1f6b2e] bg-[#0d2818]' : 'border-[#6b1f1f] bg-[#280d0d]'}`}>
      <button
        onClick={() => !test.passed && setExpanded(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        {test.passed
          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        }
        <span className={`flex-1 font-mono truncate ${test.passed ? 'text-green-300' : 'text-red-300'}`}>
          {test.name}
        </span>
        <span className="text-[#555] ml-2 flex-shrink-0">{test.duration}ms</span>
        {test.points_possible > 0 && (
          <span className={`ml-2 flex-shrink-0 ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
            {test.points_earned}/{test.points_possible}pt
          </span>
        )}
        {!test.passed && test.error && (
          expanded
            ? <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
            : <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {!test.passed && expanded && test.error && (
        <pre className="px-3 pb-2 text-[11px] text-red-300 font-mono whitespace-pre-wrap leading-relaxed border-t border-[#6b1f1f] pt-2 overflow-x-auto">
          {test.error}
        </pre>
      )}
    </div>
  )
}

function OutputPanel({
  output,
  runState,
  onClose,
}: {
  output: OutputState
  runState: RunState
  onClose: () => void
}) {
  const result = output.submitResult ?? output.runResult

  return (
    <div className="h-[260px] flex flex-col flex-shrink-0 bg-[#0d1117] border-t border-[#30363d]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#30363d] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400">
            {output.mode === 'submit' ? 'Submit Results' : 'Test Results'}
          </span>
          {runState === 'done' && result && (
            <VerdictBadge verdict={result.verdict} />
          )}
          {runState === 'done' && output.submitResult && (
            <span className="text-xs font-semibold text-gray-300">
              {output.submitResult.score}/{output.submitResult.max_score} pts
            </span>
          )}
        </div>
        <button aria-label="Close output" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {runState === 'running' && (
          <div className="flex items-center gap-2 text-gray-400 text-xs pt-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Running tests…
          </div>
        )}

        {runState === 'done' && output.mode === 'mock' && (
          <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap leading-relaxed">
            {output.mockText}
          </pre>
        )}

        {runState === 'done' && output.error && (
          <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap leading-relaxed">
            {output.error}
          </pre>
        )}

        {runState === 'done' && result && !output.error && (
          <>
            {/* Score breakdown (submit only) */}
            {output.submitResult?.breakdown && (
              <div className="flex gap-2 flex-wrap pb-1">
                {Object.entries(output.submitResult.breakdown).map(([cat, { earned, total }]) => (
                  <div key={cat} className="bg-[#1c2128] rounded px-2 py-1 text-[11px]">
                    <span className="text-gray-400">{cat}: </span>
                    <span className={earned === total ? 'text-green-400' : 'text-yellow-400'}>
                      {earned}/{total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Per-test rows */}
            {result.tests.length > 0
              ? result.tests.map(t => <TestRow key={t.id} test={t} />)
              : (
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {result.stdout || result.stderr || '(no output)'}
                </pre>
              )
            }

            {/* Stderr if present */}
            {result.stderr && result.tests.length > 0 && (
              <pre className="text-[11px] text-yellow-300 font-mono whitespace-pre-wrap pt-1 border-t border-[#30363d] mt-1">
                {result.stderr}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProblemSolvingPage() {
  const { id } = useParams<{ id: string }>()
  const problem = problems.find((p) => p.id === id)

  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(STARTER_CODE['python'])
  const [runState, setRunState] = useState<RunState>('idle')
  const [showOutput, setShowOutput] = useState(false)
  const [output, setOutput] = useState<OutputState>({ mode: 'mock' })
  const [submissions, setSubmissions] = useState<Submission[]>(loadSubmissions)

  const accentColor = problem ? (categoryColors[problem.categoryKey] ?? '#6b7280') : '#6b7280'

  const problemSubmissions = submissions
    .filter((s) => s.problemId === id)
    .sort((a, b) => b.timestamp - a.timestamp)

  function handleLanguageChange(lang: Language) {
    if (code !== STARTER_CODE[language]) {
      if (!window.confirm('Switching language will reset your code. Continue?')) return
    }
    setLanguage(lang)
    setCode(STARTER_CODE[lang])
  }

  async function handleRun() {
    if (!problem) return
    setRunState('running')
    setShowOutput(true)
    setOutput({ mode: 'run' })

    try {
      const result = await apiRun(problem.id, code, language)
      setOutput({ mode: 'run', runResult: result })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      // 404 means no evaluator set up yet — fall back to mock
      if (msg.includes('404') || msg.toLowerCase().includes('not yet')) {
        setOutput({
          mode: 'mock',
          mockText: MOCK_OUTPUT[problem.categoryKey] ?? '(no output)',
        })
      } else {
        setOutput({ mode: 'run', error: msg })
      }
    } finally {
      setRunState('done')
    }
  }

  async function handleSubmit() {
    if (!problem) return
    setRunState('running')
    setShowOutput(true)
    setOutput({ mode: 'submit' })
    setActiveTab('submissions')

    try {
      const result = await apiSubmit(problem.id, code, language)
      setOutput({ mode: 'submit', submitResult: result })

      const sub: Submission = {
        id: `sub-${Date.now()}`,
        problemId: problem.id,
        language,
        code,
        timestamp: Date.now(),
        verdict: result.verdict,
        score: result.score,
        max_score: result.max_score,
        passed: result.passed,
        total: result.total,
        execution_time_ms: result.execution_time_ms,
        breakdown: result.breakdown,
      }
      const updated = [sub, ...submissions]
      setSubmissions(updated)
      saveSubmissions(updated)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('404') || msg.toLowerCase().includes('not yet')) {
        // Fallback: mock accepted submission
        setOutput({
          mode: 'mock',
          mockText: MOCK_OUTPUT[problem.categoryKey] ?? '(no output)',
        })
        const sub: Submission = {
          id: `sub-${Date.now()}`,
          problemId: problem.id,
          language,
          code,
          timestamp: Date.now(),
          verdict: 'Accepted',
          passed: 0,
          total: 0,
          execution_time_ms: 0,
        }
        const updated = [sub, ...submissions]
        setSubmissions(updated)
        saveSubmissions(updated)
      } else {
        setOutput({ mode: 'submit', error: msg })
      }
    } finally {
      setRunState('done')
    }
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-4">
        <p className="text-gray-500 text-lg">Problem not found.</p>
        <Link to="/problems" className="text-blue-600 hover:underline text-sm">
          ← Back to Problems
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      {/* ── Top Bar ── */}
      <div
        className="flex items-center gap-4 px-4 h-[48px] bg-white border-b border-gray-200 border-l-4 flex-shrink-0"
        style={{ borderLeftColor: accentColor }}
      >
        <Link
          to="/problems"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Problems
        </Link>
        <span className="text-gray-300">|</span>
        <span className="font-semibold text-sm text-gray-900 truncate">{problem.title}</span>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="w-[40%] flex flex-col border-r border-gray-200 bg-white overflow-hidden">
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {(['description', 'editorial', 'solutions', 'submissions'] as TabId[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab ? '' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab ? { borderBottomColor: accentColor, color: accentColor } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'description' && <DescriptionTab problem={problem} accentColor={accentColor} />}
            {activeTab === 'editorial' && <EditorialTab />}
            {activeTab === 'solutions' && <SolutionsTab />}
            {activeTab === 'submissions' && <SubmissionsTab submissions={problemSubmissions} />}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-[#404040] flex-shrink-0">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="text-xs border border-[#555] rounded px-2 py-1.5 bg-[#3c3c3c] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>
              ))}
            </select>

            <div className="flex-1" />

            <button
              onClick={handleRun}
              disabled={runState === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#3c3c3c] text-gray-200 hover:bg-[#4c4c4c] border border-[#555] transition-colors disabled:opacity-50"
            >
              {runState === 'running' && output.mode === 'run'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Play className="w-3.5 h-3.5" />
              }
              Run
            </button>

            <button
              onClick={handleSubmit}
              disabled={runState === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {runState === 'running' && output.mode === 'submit'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
              Submit
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={MONACO_LANGUAGE[language]}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 4,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
              loading={
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Loading editor…
                </div>
              }
            />
          </div>

          {/* Output Panel */}
          {showOutput && (
            <OutputPanel
              output={output}
              runState={runState}
              onClose={() => setShowOutput(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tab Content Components ───────────────────────────────────────────────────

function DescriptionTab({ problem, accentColor }: { problem: Problem; accentColor: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          {problem.categoryKey.replace(/-/g, ' ')}
        </span>
        {problem.tags.map((tag) => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            {tag}
          </span>
        ))}
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">{problem.title}</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{problem.description}</p>
      </div>

      {problem.unlocksNodeIds.length > 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 p-3 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium mb-1">Unlocks roadmap nodes</p>
          <p className="text-xs text-gray-500">
            Solving this problem unlocks {problem.unlocksNodeIds.length} node
            {problem.unlocksNodeIds.length !== 1 ? 's' : ''} on the roadmap.
          </p>
        </div>
      )}
    </div>
  )
}

function EditorialTab() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">📝</div>
      <div>
        <p className="text-sm font-medium text-gray-700">Editorial coming soon</p>
        <p className="text-xs text-gray-400 mt-1">Step-by-step explanations will be added here.</p>
      </div>
    </div>
  )
}

function SolutionsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">💡</div>
      <div>
        <p className="text-sm font-medium text-gray-700">Community solutions coming soon</p>
        <p className="text-xs text-gray-400 mt-1">Top-rated community approaches will appear here.</p>
      </div>
    </div>
  )
}

function SubmissionsTab({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">🚀</div>
        <div>
          <p className="text-sm font-medium text-gray-700">No submissions yet</p>
          <p className="text-xs text-gray-400 mt-1">Click Submit to record your first attempt.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">
        {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
      </p>
      {submissions.map((sub) => (
        <div key={sub.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VerdictBadge verdict={sub.verdict} />
              {sub.score != null && (
                <span className="text-xs text-gray-500 font-medium">
                  {sub.score}/{sub.max_score ?? '?'} pts
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatTimestamp(sub.timestamp)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{LANGUAGE_LABELS[sub.language] ?? sub.language}</span>
            {sub.total > 0 && (
              <>
                <span>·</span>
                <span>{sub.passed}/{sub.total} tests</span>
              </>
            )}
            {sub.execution_time_ms > 0 && (
              <>
                <span>·</span>
                <span>{sub.execution_time_ms}ms</span>
              </>
            )}
          </div>
          {sub.breakdown && (
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {Object.entries(sub.breakdown).map(([cat, { earned, total }]) => (
                <span
                  key={cat}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    earned === total ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {cat}: {earned}/{total}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
