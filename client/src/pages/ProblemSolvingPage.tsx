import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { ArrowLeft, Play, Send, X, Loader2 } from 'lucide-react'
import { problems, type Problem } from '@/data/problems-data'
import { categoryColors } from '@/lib/mindmap-layout'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'description' | 'editorial' | 'solutions' | 'submissions'
type Language = 'python' | 'javascript' | 'typescript'
type RunState = 'idle' | 'running' | 'done'
type Verdict = 'Accepted' | 'Wrong Answer' | 'Runtime Error'

interface Submission {
  id: string
  problemId: string
  language: Language
  code: string
  timestamp: number
  verdict: Verdict
  runtime: string
  memory: string
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

const MOCK_OUTPUT: Record<string, string> = {
  'neural-networks':
    'Epoch   1/100 | Loss: 2.3026\nEpoch  25/100 | Loss: 1.1403\nEpoch  50/100 | Loss: 0.4821\nEpoch  75/100 | Loss: 0.1837\nEpoch 100/100 | Loss: 0.0142\n\nFinal training accuracy: 97.3%',
  perceptron:
    'Step 1: weights=[0.10, 0.00]  misclassified=3\nStep 3: weights=[0.35, -0.20]  misclassified=1\nStep 7: weights=[0.60, -0.40]  misclassified=0\n\nConverged in 7 steps.',
  optimization:
    'Optimizer  | Final Loss | Steps\n-----------+------------+------\nSGD        |     0.1823 |  200\nMomentum   |     0.0941 |  200\nAdaGrad    |     0.1105 |  200\nAdam       |     0.0312 |  200',
  regularization:
    'L2 λ=0.001 | val_loss=0.412\nL2 λ=0.01  | val_loss=0.312\nL2 λ=0.1   | val_loss=0.289  ← best\nL2 λ=1.0   | val_loss=0.501\n\nBest λ=0.1 (val_loss 0.289)',
  transformers:
    'Q shape: (1, 8, 64)  K shape: (1, 8, 64)  V shape: (1, 8, 64)\nAttention scores shape: (1, 8, 8)\nOutput shape: (1, 8, 512)\n\nAll assertions passed.',
  'vision-language':
    'Patch embeddings: (196, 768)\nCLS token appended: (197, 768)\nAfter transformer: (197, 768)\nTop-1 accuracy: 81.4%',
  'self-supervised':
    'Contrastive loss (epoch  1): 2.1034\nContrastive loss (epoch 10): 0.9821\nContrastive loss (epoch 50): 0.4300\n\nLinear probe accuracy: 74.2%',
  'graph-networks':
    'Graph loaded: 2708 nodes, 5429 edges, 7 classes\nGCN epoch  1: train_acc=0.367 val_acc=0.512\nGCN epoch 50: train_acc=0.991 val_acc=0.812\n\nTest accuracy: 81.5%',
  training:
    'Epoch  1 | train_loss=1.843 | val_loss=1.912 | lr=0.01000\nEpoch  5 | train_loss=0.812 | val_loss=0.891 | lr=0.00500\nEpoch 10 | train_loss=0.412 | val_loss=0.487 | lr=0.00250',
  advanced:
    'Loading model weights... done\nGenerating (max_new_tokens=50):\n\n"The transformer architecture enables parallelisation\nacross the sequence dimension, allowing models to capture\nlong-range dependencies more efficiently than RNNs."\n\nGeneration complete.',
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
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[verdict]}`}>
      {verdict}
    </span>
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
  const [submissions, setSubmissions] = useState<Submission[]>(loadSubmissions)

  const accentColor = problem ? (categoryColors[problem.categoryKey] ?? '#6b7280') : '#6b7280'

  // Filter submissions for this problem
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

  function handleRun() {
    setRunState('running')
    setShowOutput(true)
    setTimeout(() => setRunState('done'), 1200)
  }

  function handleSubmit() {
    setRunState('running')
    setShowOutput(true)
    setTimeout(() => {
      setRunState('done')
      if (!problem) return
      const sub: Submission = {
        id: `sub-${Date.now()}`,
        problemId: problem.id,
        language,
        code,
        timestamp: Date.now(),
        verdict: 'Accepted',
        runtime: `${90 + Math.floor(Math.random() * 100)} ms`,
        memory: `${(14 + Math.random() * 4).toFixed(1)} MB`,
      }
      const updated = [sub, ...submissions]
      setSubmissions(updated)
      saveSubmissions(updated)
    }, 1400)
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

  const mockOutput = MOCK_OUTPUT[problem.categoryKey] ?? 'Output:\n(no output)'

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
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {(['description', 'editorial', 'solutions', 'submissions'] as TabId[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={
                  activeTab === tab
                    ? { borderBottomColor: accentColor, color: accentColor }
                    : undefined
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'description' && (
              <DescriptionTab problem={problem} accentColor={accentColor} />
            )}
            {activeTab === 'editorial' && <EditorialTab />}
            {activeTab === 'solutions' && <SolutionsTab />}
            {activeTab === 'submissions' && (
              <SubmissionsTab submissions={problemSubmissions} />
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Editor Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-[#404040] flex-shrink-0">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="text-xs border border-[#555] rounded px-2 py-1.5 bg-[#3c3c3c] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </select>

            <div className="flex-1" />

            <button
              onClick={handleRun}
              disabled={runState === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#3c3c3c] text-gray-200 hover:bg-[#4c4c4c] border border-[#555] transition-colors disabled:opacity-50"
            >
              {runState === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Run
            </button>

            <button
              onClick={handleSubmit}
              disabled={runState === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {runState === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
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

          {/* Output Console */}
          {showOutput && (
            <div className="h-[180px] flex flex-col flex-shrink-0 bg-[#0d1117] border-t border-[#30363d]">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#30363d] flex-shrink-0">
                <span className="text-xs font-medium text-gray-400">Output</span>
                <div className="flex items-center gap-3">
                  {runState === 'done' && (
                    <span className="text-xs font-semibold text-green-400">✓ Finished</span>
                  )}
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2">
                {runState === 'running' ? (
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Running…
                  </div>
                ) : (
                  <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {mockOutput}
                  </pre>
                )}
              </div>
            </div>
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
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
        📝
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">Editorial coming soon</p>
        <p className="text-xs text-gray-400 mt-1">
          Step-by-step explanations will be added here.
        </p>
      </div>
    </div>
  )
}

function SolutionsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
        💡
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">Community solutions coming soon</p>
        <p className="text-xs text-gray-400 mt-1">
          Top-rated community approaches will appear here.
        </p>
      </div>
    </div>
  )
}

function SubmissionsTab({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
          🚀
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">No submissions yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Click Submit to record your first attempt.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <VerdictBadge verdict={sub.verdict} />
            <span className="text-xs text-gray-400">{formatTimestamp(sub.timestamp)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{LANGUAGE_LABELS[sub.language as Language] ?? sub.language}</span>
            <span>·</span>
            <span>{sub.runtime}</span>
            <span>·</span>
            <span>{sub.memory}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
