import { useCallback, useState, useMemo, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { mindMapNodes, type MindMapNode } from '@/data/mindmap-data'
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react'
import {
  CATEGORY_KEYS,
  categoryColors,
  nodeTypes,
  buildMindMapLayout,
} from '@/lib/mindmap-layout'

// ─── Main Component ───────────────────────────────────────────────────────────

interface CategoryGroup {
  categoryId: string
  categoryName: string
  color: string
  topics: MindMapNode[]
}

export default function RoadmapPage() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dl-roadmap-completed')
      if (saved) return new Set(JSON.parse(saved) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [showSidebar, setShowSidebar] = useState(true)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('dl-roadmap-completed', JSON.stringify([...completedItems]))
  }, [completedItems])

  const toggleComplete = useCallback((id: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleCategory = useCallback((catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }, [])

  // Layout computed once — mindMapNodes is a stable module constant
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildMindMapLayout(mindMapNodes), [])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Sidebar data — must come before updatedNodes so categoryGroups is available
  const childrenMap = useMemo(() => {
    const map = new Map<string, MindMapNode[]>()
    mindMapNodes.forEach((n) => {
      if (n.parentId) {
        if (!map.has(n.parentId)) map.set(n.parentId, [])
        map.get(n.parentId)!.push(n)
      }
    })
    return map
  }, [])

  const rootNode = useMemo(() => mindMapNodes.find((n) => n.parentId === null)!, [])

  const categoryGroups = useMemo((): CategoryGroup[] => {
    const l1Nodes = childrenMap.get(rootNode.id) ?? []
    return l1Nodes.map((l1, i) => {
      const descendants: MindMapNode[] = []
      function collect(id: string) {
        for (const child of childrenMap.get(id) ?? []) {
          descendants.push(child)
          collect(child.id)
        }
      }
      collect(l1.id)
      return {
        categoryId: l1.id,
        categoryName: l1.name,
        color: categoryColors[CATEGORY_KEYS[i] ?? 'neural-networks'] ?? '#6b7280',
        topics: descendants,
      }
    })
  }, [childrenMap, rootNode])

  // Overlay completion state + compute per-category completion ratio
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
        onToggle: () => toggleComplete(node.id),
      },
    }))
  }, [nodes, completedItems, toggleComplete, categoryGroups])

  // Dim inactive edges; light up edges whose target has any completion
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
          opacity: isActive ? 1 : 0.15,
          transition: 'opacity 0.6s ease',
        },
      }
    })
  }, [edges, completedItems, categoryGroups])

  const allCompletableIds = useMemo(
    () => new Set(categoryGroups.flatMap((g) => g.topics.map((t) => t.id))),
    [categoryGroups]
  )
  const totalItems = allCompletableIds.size
  const completedCount = [...completedItems].filter((id) => allCompletableIds.has(id)).length
  const progress = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0

  return (
    <div className="flex w-full h-[calc(100vh-80px)]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 bg-white border-r border-gray-200 overflow-hidden flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Topics</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 text-sm leading-none"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-1.5">{completedCount} / {totalItems} completed</div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {categoryGroups.map((group) => {
              const isCollapsed = collapsedCategories.has(group.categoryId)
              const groupCompleted = group.topics.filter((t) => completedItems.has(t.id)).length
              return (
                <div key={group.categoryId}>
                  <button
                    onClick={() => toggleCategory(group.categoryId)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                    <span className="font-semibold text-sm text-gray-800 flex-1 text-left truncate">
                      {group.categoryName}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {groupCompleted}/{group.topics.length}
                    </span>
                    {isCollapsed
                      ? <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    }
                  </button>

                  {!isCollapsed && group.topics.length > 0 && (
                    <div className="ml-5 mr-3 mb-1">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${(groupCompleted / group.topics.length) * 100}%`,
                            backgroundColor: group.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!isCollapsed && (
                    <div className="ml-4 mb-1 space-y-0.5">
                      {group.topics.map((topic) => {
                        const done = completedItems.has(topic.id)
                        return (
                          <button
                            key={topic.id}
                            onClick={() => toggleComplete(topic.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                              done ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 flex-shrink-0" style={{ color: group.color }} />
                            )}
                            <span className={done ? 'line-through' : ''}>{topic.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={updatedNodes}
          edges={updatedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.03}
          maxZoom={1.5}
        >
          <Background color="#e2e8f0" gap={28} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.data?.isCompleted) return categoryColors[node.data?.category ?? ''] ?? '#10b981'
              if (node.data?.completionRatio > 0) return categoryColors[node.data?.category ?? ''] ?? '#94a3b8'
              return '#d1d5db'
            }}
            maskColor="rgba(240, 240, 240, 0.6)"
          />
          {!showSidebar && (
            <Panel position="top-left" className="bg-white rounded-lg shadow-lg px-4 py-3 m-4 flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Show Topics
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">{progress}% complete</span>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  )
}
