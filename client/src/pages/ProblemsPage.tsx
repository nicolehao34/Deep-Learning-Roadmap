import { useCallback, useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactFlow, { Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { mindMapNodes } from '@/data/mindmap-data'
import { problems, problemsByCategory, type Problem } from '@/data/problems-data'
import {
  CATEGORY_KEYS,
  categoryColors,
  nodeTypes,
  buildMindMapLayout,
} from '@/lib/mindmap-layout'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Plus,
  BookOpen,
  ListChecks,
  X,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProblemList {
  id: string
  name: string
  problemIds: string[]
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Problem['difficulty'] }) {
  const colors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[difficulty]}`}>
      {difficulty}
    </span>
  )
}

// ─── Problem Card ─────────────────────────────────────────────────────────────

function ProblemCard({
  problem,
  solved,
  onToggle,
  onAddToList,
  lists,
}: {
  problem: Problem
  solved: boolean
  onToggle: () => void
  onAddToList: (listId: string, problemId: string) => void
  lists: ProblemList[]
}) {
  const [showListMenu, setShowListMenu] = useState(false)
  const color = categoryColors[problem.categoryKey] ?? '#6b7280'

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${
        solved ? 'border-opacity-50 bg-opacity-50' : 'border-gray-200 bg-white'
      }`}
      style={{
        borderColor: solved ? color : undefined,
        backgroundColor: solved ? `${color}0d` : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Add to list */}
          <div className="relative">
            <button
              onClick={() => setShowListMenu((v) => !v)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Add to list"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {showListMenu && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-1">
                {lists.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400">No lists yet</div>
                ) : (
                  lists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => { onAddToList(list.id, problem.id); setShowListMenu(false) }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {list.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Link
        to={`/problems/${problem.id}`}
        className={`font-semibold text-sm mb-1.5 hover:underline block ${
          solved ? 'text-gray-400' : 'text-gray-900 hover:text-blue-600'
        }`}
      >
        {problem.title}
      </Link>
      <p className={`text-xs leading-relaxed mb-3 ${solved ? 'text-gray-400' : 'text-gray-600'}`}>
        {problem.description}
      </p>

      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-300 ${
          solved
            ? 'bg-green-50 text-green-600 hover:bg-green-100'
            : 'text-white hover:opacity-90'
        }`}
        style={solved ? undefined : { backgroundColor: color }}
      >
        {solved ? (
          <><CheckCircle2 className="w-3.5 h-3.5" /> Solved</>
        ) : (
          <><Circle className="w-3.5 h-3.5" /> Mark Solved</>
        )}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  'neural-networks': 'Neural Networks',
  'perceptron': 'Perceptron & Activations',
  'optimization': 'Optimization',
  'regularization': 'Regularization',
  'transformers': 'Transformers',
  'vision-language': 'Vision & Language',
  'self-supervised': 'Self-Supervised',
  'graph-networks': 'Graph Networks',
  'training': 'Training',
  'advanced': 'Advanced Topics',
}

const { nodes: initialNodes, edges: initialEdges } = buildMindMapLayout(mindMapNodes)

export default function ProblemsPage() {
  // ── Solved problems ──────────────────────────────────────────────────────
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dl-solved-problems')
      if (saved) return new Set(JSON.parse(saved) as string[])
    } catch { /* ignore */ }
    return new Set()
  })

  useEffect(() => {
    localStorage.setItem('dl-solved-problems', JSON.stringify([...solvedProblems]))
  }, [solvedProblems])

  // ── Completed mindmap nodes (derived + synced) ───────────────────────────
  const completedItems = useMemo<Set<string>>(() => {
    const ids = new Set<string>()
    for (const p of problems) {
      if (solvedProblems.has(p.id)) {
        for (const nid of p.unlocksNodeIds) ids.add(nid)
      }
    }
    return ids
  }, [solvedProblems])

  useEffect(() => {
    localStorage.setItem('dl-roadmap-completed', JSON.stringify([...completedItems]))
  }, [completedItems])

  // ── Tab ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(CATEGORY_KEYS[0])

  // ── My Lists ─────────────────────────────────────────────────────────────
  const [myLists, setMyLists] = useState<ProblemList[]>(() => {
    try {
      const saved = localStorage.getItem('dl-problem-lists')
      if (saved) return JSON.parse(saved) as ProblemList[]
    } catch { /* ignore */ }
    return []
  })

  useEffect(() => {
    localStorage.setItem('dl-problem-lists', JSON.stringify(myLists))
  }, [myLists])

  const [sidebarView, setSidebarView] = useState<'library' | 'my-list'>('library')
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [collapsedLists, setCollapsedLists] = useState<Set<string>>(new Set())
  const [addingList, setAddingList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const addList = useCallback(() => {
    const name = newListName.trim()
    if (!name) return
    const newList: ProblemList = { id: `list-${Date.now()}`, name, problemIds: [] }
    setMyLists((prev) => [...prev, newList])
    setNewListName('')
    setAddingList(false)
  }, [newListName])

  const addToList = useCallback((listId: string, problemId: string) => {
    setMyLists((prev) =>
      prev.map((l) =>
        l.id === listId && !l.problemIds.includes(problemId)
          ? { ...l, problemIds: [...l.problemIds, problemId] }
          : l
      )
    )
  }, [])

  const removeFromList = useCallback((listId: string, problemId: string) => {
    setMyLists((prev) =>
      prev.map((l) =>
        l.id === listId ? { ...l, problemIds: l.problemIds.filter((id) => id !== problemId) } : l
      )
    )
  }, [])

  const deleteList = useCallback((listId: string) => {
    setMyLists((prev) => prev.filter((l) => l.id !== listId))
    if (selectedListId === listId) setSelectedListId(null)
  }, [selectedListId])

  const toggleListCollapse = useCallback((listId: string) => {
    setCollapsedLists((prev) => {
      const next = new Set(prev)
      next.has(listId) ? next.delete(listId) : next.add(listId)
      return next
    })
  }, [])

  const toggleSolved = useCallback((problemId: string) => {
    setSolvedProblems((prev) => {
      const next = new Set(prev)
      next.has(problemId) ? next.delete(problemId) : next.add(problemId)
      return next
    })
  }, [])

  // ── Displayed problems (center) ───────────────────────────────────────────
  const displayedProblems = useMemo(() => {
    if (sidebarView === 'my-list' && selectedListId) {
      const list = myLists.find((l) => l.id === selectedListId)
      if (list) {
        const idSet = new Set(list.problemIds)
        return problems.filter((p) => idSet.has(p.id) && p.categoryKey === activeTab)
      }
    }
    return problemsByCategory[activeTab] ?? []
  }, [sidebarView, selectedListId, myLists, activeTab])

  // ── ReactFlow for roadmap preview ─────────────────────────────────────────
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Build category groups for completionRatio computation
  const childrenMap = useMemo(() => {
    const map = new Map<string, typeof mindMapNodes>()
    mindMapNodes.forEach((n) => {
      if (n.parentId) {
        if (!map.has(n.parentId)) map.set(n.parentId, [])
        map.get(n.parentId)!.push(n)
      }
    })
    return map
  }, [])

  const rootNode = useMemo(() => mindMapNodes.find((n) => n.parentId === null), [])

  const categoryGroups = useMemo(() => {
    if (!rootNode) return []
    const l1Nodes = childrenMap.get(rootNode.id) ?? []
    return l1Nodes.map((l1, i) => {
      const descendants: typeof mindMapNodes = []
      function collect(id: string) {
        for (const child of childrenMap.get(id) ?? []) {
          descendants.push(child)
          collect(child.id)
        }
      }
      collect(l1.id)
      return {
        categoryId: l1.id,
        topics: descendants,
      }
    })
  }, [childrenMap, rootNode])

  const updatedNodes = useMemo(() => {
    const categoryRatios = new Map<string, number>()
    for (const group of categoryGroups) {
      const done = group.topics.filter((t) => completedItems.has(t.id)).length
      categoryRatios.set(group.categoryId, group.topics.length > 0 ? done / group.topics.length : 0)
    }
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isCompleted: completedItems.has(node.id),
        completionRatio:
          node.data.level === 1
            ? (categoryRatios.get(node.id) ?? 0)
            : completedItems.has(node.id) ? 1 : 0,
        onToggle: () => {},
      },
    }))
  }, [nodes, completedItems, categoryGroups])

  const updatedEdges = useMemo(() => {
    const activated = new Set<string>()
    for (const group of categoryGroups) {
      for (const topic of group.topics) {
        if (completedItems.has(topic.id)) {
          activated.add(topic.id)
          activated.add(group.categoryId)
        }
      }
    }
    return edges.map((edge) => {
      const isActive = activated.has(edge.target)
      const color = (edge.data as { categoryColor?: string })?.categoryColor ?? '#94a3b8'
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: color,
          opacity: isActive ? 1 : 0.12,
          transition: 'opacity 0.6s ease',
        },
      }
    })
  }, [edges, completedItems, categoryGroups])

  // ── Progress ──────────────────────────────────────────────────────────────
  const totalProblems = problems.length
  const solvedCount = solvedProblems.size
  const progress = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  return (
    <div className="flex w-full h-[calc(100vh-80px)]">
      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        {/* Progress */}
        <div className="p-3 border-b border-gray-100">
          <div className="text-xs text-gray-500 mb-1">{solvedCount} / {totalProblems} solved</div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Nav */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setSidebarView('library'); setSelectedListId(null) }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              sidebarView === 'library'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Library
          </button>
          <button
            onClick={() => setSidebarView('my-list')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              sidebarView === 'my-list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            My List
          </button>
        </div>

        {/* Library view */}
        {sidebarView === 'library' && (
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {CATEGORY_KEYS.map((key) => {
              const catProblems = problemsByCategory[key] ?? []
              const solvedInCat = catProblems.filter((p) => solvedProblems.has(p.id)).length
              const color = categoryColors[key] ?? '#6b7280'
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className={`text-xs flex-1 truncate font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {CATEGORY_LABELS[key]}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{solvedInCat}/{catProblems.length}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* My List view */}
        {sidebarView === 'my-list' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {myLists.map((list) => {
                const isCollapsed = collapsedLists.has(list.id)
                const isSelected = selectedListId === list.id
                const solvedInList = list.problemIds.filter((id) => solvedProblems.has(id)).length
                return (
                  <div key={list.id}>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <button onClick={() => toggleListCollapse(list.id)} className="flex-shrink-0">
                        {isCollapsed
                          ? <ChevronRight className="w-3 h-3 text-gray-400" />
                          : <ChevronDown className="w-3 h-3 text-gray-400" />
                        }
                      </button>
                      <button
                        className={`flex-1 text-left text-xs font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}
                        onClick={() => setSelectedListId(isSelected ? null : list.id)}
                      >
                        {list.name}
                      </button>
                      <span className="text-xs text-gray-400 flex-shrink-0">{solvedInList}/{list.problemIds.length}</span>
                      <button
                        onClick={() => deleteList(list.id)}
                        className="flex-shrink-0 p-0.5 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {!isCollapsed && list.problemIds.length > 0 && (
                      <div className="ml-5 mr-2 mb-1 space-y-0.5">
                        {list.problemIds.map((pid) => {
                          const p = problems.find((x) => x.id === pid)
                          if (!p) return null
                          return (
                            <div key={pid} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-50 group">
                              <span className={`text-xs flex-1 truncate ${solvedProblems.has(pid) ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                {p.title}
                              </span>
                              <button
                                onClick={() => removeFromList(list.id, pid)}
                                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Add list input */}
              {addingList ? (
                <div className="px-2 py-1.5">
                  <input
                    autoFocus
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addList(); if (e.key === 'Escape') { setAddingList(false); setNewListName('') } }}
                    placeholder="List name…"
                    className="w-full text-xs border border-blue-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="flex gap-1 mt-1">
                    <button onClick={addList} className="flex-1 text-xs bg-blue-600 text-white rounded py-1 hover:bg-blue-700">Add</button>
                    <button onClick={() => { setAddingList(false); setNewListName('') }} className="flex-1 text-xs bg-gray-100 text-gray-600 rounded py-1 hover:bg-gray-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingList(true)}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add list
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Center: tabs + problem cards ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white overflow-x-auto">
          <div className="flex px-4 gap-0 min-w-max">
            {CATEGORY_KEYS.map((key) => {
              const isActive = activeTab === key
              const color = categoryColors[key] ?? '#6b7280'
              return (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); if (sidebarView === 'library') setSidebarView('library') }}
                  className={`px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive ? 'border-current' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={isActive ? { color, borderColor: color } : undefined}
                >
                  {CATEGORY_LABELS[key]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Problem list */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayedProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <ListChecks className="w-8 h-8 mb-2 opacity-40" />
              <span className="text-sm">No problems here yet</span>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {displayedProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  solved={solvedProblems.has(problem.id)}
                  onToggle={() => toggleSolved(problem.id)}
                  onAddToList={addToList}
                  lists={myLists}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: roadmap preview ────────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="px-3 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="text-xs font-semibold text-gray-700">Roadmap Progress</div>
          <div className="text-xs text-gray-400 mt-0.5">{progress}% complete</div>
        </div>
        <div className="flex-1 relative">
          <ReactFlow
            nodes={updatedNodes}
            edges={updatedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.08 }}
            minZoom={0.02}
            maxZoom={1}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background color="#e2e8f0" gap={24} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
