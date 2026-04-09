import { useCallback, useState, useMemo, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { mindMapNodes, type MindMapNode } from '@/data/mindmap-data'
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_WIDTH = 180
const NODE_HEIGHT = 32
const H_GAP = 90
const V_GAP = 6

const CATEGORY_KEYS = [
  'neural-networks',
  'perceptron',
  'optimization',
  'regularization',
  'transformers',
  'vision-language',
  'self-supervised',
  'graph-networks',
  'training',
  'advanced',
]

const categoryColors: Record<string, string> = {
  'neural-networks':  '#8b5cf6',
  'perceptron':       '#3b82f6',
  'optimization':     '#f59e0b',
  'regularization':   '#ef4444',
  'transformers':     '#ec4899',
  'vision-language':  '#06b6d4',
  'self-supervised':  '#10b981',
  'graph-networks':   '#84cc16',
  'training':         '#f97316',
  'advanced':         '#a855f7',
}

// ─── Node Components ──────────────────────────────────────────────────────────

interface CustomNodeData {
  label: string
  isCompleted: boolean
  onToggle: () => void
  category: string
  level: number
  side: 'left' | 'right' | 'root'
}

function RootNode({ data }: { data: CustomNodeData }) {
  return (
    <>
      <Handle type="source" id="right" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" id="left" position={Position.Left} style={{ opacity: 0 }} />
      <div className="px-6 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-center select-none min-w-[160px]">
        <div className="text-white font-bold text-xl leading-tight">{data.label}</div>
      </div>
    </>
  )
}

function CategoryNode({ data }: { data: CustomNodeData }) {
  const color = categoryColors[data.category] ?? '#6b7280'
  const isLeft = data.side === 'left'
  return (
    <>
      <Handle
        type="target"
        position={isLeft ? Position.Right : Position.Left}
        style={{ opacity: 0 }}
      />
      <div
        className="px-4 py-1.5 rounded-full font-bold text-sm text-white shadow-md select-none min-w-[100px] text-center"
        style={{ backgroundColor: color }}
      >
        {data.label}
      </div>
      <Handle
        type="source"
        position={isLeft ? Position.Left : Position.Right}
        style={{ opacity: 0 }}
      />
    </>
  )
}

function TopicNode({ data }: { data: CustomNodeData }) {
  const color = categoryColors[data.category] ?? '#6b7280'
  const isLeft = data.side === 'left'
  const done = data.isCompleted
  return (
    <>
      <Handle
        type="target"
        position={isLeft ? Position.Right : Position.Left}
        style={{ opacity: 0 }}
      />
      <div
        className={`px-2.5 py-1 rounded-md border text-xs shadow-sm max-w-[180px] transition-all ${
          done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
        }`}
      >
        <div className={`flex items-center gap-1.5 ${isLeft ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={data.onToggle}
            className="flex-shrink-0 transition-transform hover:scale-110"
          >
            {done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Circle className="w-3.5 h-3.5" style={{ color }} />
            )}
          </button>
          <span
            className={`leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-700'} ${
              isLeft ? 'text-right' : 'text-left'
            }`}
          >
            {data.label}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={isLeft ? Position.Left : Position.Right}
        style={{ opacity: 0 }}
      />
    </>
  )
}

const nodeTypes = {
  root: RootNode,
  category: CategoryNode,
  topic: TopicNode,
}

// ─── Layout Algorithm ─────────────────────────────────────────────────────────

function buildMindMapLayout(rawNodes: MindMapNode[]): {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
} {
  // Deduplicate by id
  const seen = new Set<string>()
  const uniqueNodes = rawNodes.filter((n) => {
    if (seen.has(n.id)) return false
    seen.add(n.id)
    return true
  })

  // Build children map
  const childrenMap = new Map<string, MindMapNode[]>()
  uniqueNodes.forEach((n) => {
    if (n.parentId) {
      if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, [])
      childrenMap.get(n.parentId)!.push(n)
    }
  })

  const rootNode = uniqueNodes.find((n) => n.parentId === null)
  if (!rootNode) return { nodes: [], edges: [] }

  // Phase 1: Count leaves per subtree
  const leafCounts = new Map<string, number>()
  function countLeaves(id: string): number {
    const children = childrenMap.get(id) ?? []
    if (children.length === 0) { leafCounts.set(id, 1); return 1 }
    const total = children.reduce((s, c) => s + countLeaves(c.id), 0)
    leafCounts.set(id, total)
    return total
  }
  countLeaves(rootNode.id)

  // Phase 2: Assign categories and sides to level-1 nodes
  // Even-indexed → right, odd-indexed → left
  const categoryOf = new Map<string, string>()
  const sideOf = new Map<string, 'left' | 'right' | 'root'>()
  const l1Nodes = childrenMap.get(rootNode.id) ?? []
  l1Nodes.forEach((n, i) => {
    categoryOf.set(n.id, CATEGORY_KEYS[i] ?? 'neural-networks')
    sideOf.set(n.id, i % 2 === 0 ? 'right' : 'left')
  })
  sideOf.set(rootNode.id, 'root')

  // Propagate categories and sides down to all descendants
  function propagateDown(nodeId: string, cat: string, side: 'left' | 'right'): void {
    for (const child of childrenMap.get(nodeId) ?? []) {
      if (!categoryOf.has(child.id)) categoryOf.set(child.id, cat)
      if (!sideOf.has(child.id)) sideOf.set(child.id, side)
      propagateDown(child.id, categoryOf.get(child.id)!, sideOf.get(child.id) as 'left' | 'right')
    }
  }
  for (const n of l1Nodes) {
    propagateDown(n.id, categoryOf.get(n.id)!, sideOf.get(n.id) as 'left' | 'right')
  }

  // Phase 3: Assign positions using leaf-count bands
  const positions = new Map<string, { x: number; y: number; level: number }>()

  function assignPositions(nodeId: string, depth: number, yOffset: number, side: 'left' | 'right'): void {
    const leaves = leafCounts.get(nodeId) ?? 1
    const bandHeight = leaves * (NODE_HEIGHT + V_GAP) - V_GAP
    const xSign = side === 'right' ? 1 : -1
    const x = xSign * depth * (NODE_WIDTH + H_GAP)
    const y = yOffset + bandHeight / 2 - NODE_HEIGHT / 2
    positions.set(nodeId, { x, y, level: depth })

    let currentY = yOffset
    for (const child of childrenMap.get(nodeId) ?? []) {
      const childBand = (leafCounts.get(child.id) ?? 1) * (NODE_HEIGHT + V_GAP)
      assignPositions(child.id, depth + 1, currentY, side)
      currentY += childBand
    }
  }

  // Root at origin
  positions.set(rootNode.id, { x: 0, y: 0, level: 0 })

  // Separate l1 by side, center each side vertically around y=0
  const rightL1 = l1Nodes.filter((_, i) => i % 2 === 0)
  const leftL1 = l1Nodes.filter((_, i) => i % 2 === 1)

  const rightLeaves = rightL1.reduce((s, n) => s + (leafCounts.get(n.id) ?? 1), 0)
  const leftLeaves = leftL1.reduce((s, n) => s + (leafCounts.get(n.id) ?? 1), 0)
  const rightTotalH = rightLeaves * (NODE_HEIGHT + V_GAP) - V_GAP
  const leftTotalH = leftLeaves * (NODE_HEIGHT + V_GAP) - V_GAP

  let rightY = -rightTotalH / 2
  for (const n of rightL1) {
    const band = (leafCounts.get(n.id) ?? 1) * (NODE_HEIGHT + V_GAP)
    assignPositions(n.id, 1, rightY, 'right')
    rightY += band
  }

  let leftY = -leftTotalH / 2
  for (const n of leftL1) {
    const band = (leafCounts.get(n.id) ?? 1) * (NODE_HEIGHT + V_GAP)
    assignPositions(n.id, 1, leftY, 'left')
    leftY += band
  }

  // Build ReactFlow nodes
  const nodes: Node<CustomNodeData>[] = []
  uniqueNodes.forEach((node) => {
    const pos = positions.get(node.id)
    if (!pos) return
    const category = categoryOf.get(node.id) ?? 'neural-networks'
    const side = sideOf.get(node.id) ?? 'right'
    const type = pos.level === 0 ? 'root' : pos.level === 1 ? 'category' : 'topic'
    nodes.push({
      id: node.id,
      type,
      position: { x: pos.x, y: pos.y },
      data: { label: node.name, isCompleted: false, onToggle: () => {}, category, level: pos.level, side },
    })
  })

  // Build edges (bezier curves, no arrows, category-colored)
  const edges: Edge[] = []
  uniqueNodes.forEach((node) => {
    if (!node.parentId) return
    if (!positions.has(node.id) || !positions.has(node.parentId)) return
    const level = positions.get(node.id)!.level
    const side = sideOf.get(node.id) ?? 'right'
    const color = categoryColors[categoryOf.get(node.id) ?? ''] ?? '#94a3b8'
    const strokeWidth = level === 1 ? 4 : level === 2 ? 2.5 : 1.5

    const edge: Edge = {
      id: `${node.parentId}-${node.id}`,
      source: node.parentId,
      target: node.id,
      type: 'default',
      animated: false,
      style: { stroke: color, strokeWidth },
    }
    // For root's edges, specify which handle (left or right)
    if (level === 1) {
      edge.sourceHandle = side === 'left' ? 'left' : 'right'
    }
    edges.push(edge)
  })

  return { nodes, edges }
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CategoryGroup {
  categoryId: string
  categoryName: string
  color: string
  topics: MindMapNode[]
}

export default function RoadmapPage() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dl-roadmap-completed')
      if (saved) setCompletedItems(new Set(JSON.parse(saved) as string[]))
    } catch { /* ignore */ }
  }, [])

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

  // Overlay completion state without recomputing layout
  const updatedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isCompleted: completedItems.has(node.id),
          onToggle: () => toggleComplete(node.id),
        },
      })),
    [nodes, completedItems, toggleComplete]
  )

  // Sidebar data
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
          edges={edges}
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
              if (node.data?.isCompleted) return '#10b981'
              return categoryColors[node.data?.category ?? ''] ?? '#94a3b8'
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
