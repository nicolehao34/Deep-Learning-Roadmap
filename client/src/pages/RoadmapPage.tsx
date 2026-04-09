import { useCallback, useState, useMemo, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { mindMapNodes, type MindMapNode } from '@/data/mindmap-data'
import { CheckCircle2, Circle } from 'lucide-react'

// Colors for different categories
const categoryColors: Record<string, string> = {
  'fundamentals': '#3b82f6', // blue
  'neural-networks': '#8b5cf6', // purple
  'deep-learning-architectures': '#ec4899', // pink
  'training-optimization': '#f59e0b', // amber
  'applications': '#10b981', // green
}

interface CustomNodeData {
  label: string
  description?: string
  isCompleted: boolean
  onToggle: () => void
  category: string
  level: number
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const color = categoryColors[data.category] || '#6b7280'
  
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={`px-3 py-2 shadow-md rounded-lg border-2 min-w-[140px] max-w-[200px] transition-all ${
          data.isCompleted ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'
        }`}
        style={{ borderColor: data.isCompleted ? '#10b981' : color }}
      >
        <div className="flex items-start gap-2">
          <button
            onClick={data.onToggle}
            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
          >
            {data.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div
              className={`font-semibold text-sm leading-snug ${
                data.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {data.label}
            </div>
            {data.description && (
              <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                {data.description}
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export default function RoadmapPage() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)

  const toggleComplete = useCallback((id: string) => {
    setCompletedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  // Convert mind map data to nodes and edges with tree layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildTreeLayout(mindMapNodes, completedItems, toggleComplete),
    [completedItems, toggleComplete]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Update edges when they change
  useEffect(() => {
    console.log('Setting edges:', initialEdges.length, 'edges')
    setEdges(initialEdges)
  }, [initialEdges, setEdges])
  
  // Debug: log edges on mount
  useEffect(() => {
    console.log('Edges in state:', edges.length)
    console.log('Sample edges:', edges.slice(0, 3))
  }, [edges])

  // Update nodes when completion status changes
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

  const totalItems = mindMapNodes.length
  const completedCount = completedItems.size
  const progress = Math.round((completedCount / totalItems) * 100)
// Group nodes by parent for sidebar
  const groupedNodes = mindMapNodes.reduce((acc, node) => {
    const parentId = node.parentId || 'root'
    if (!acc[parentId]) acc[parentId] = []
    acc[parentId].push(node)
    return acc
  }, {} as Record<string, MindMapNode[]>)

  return (
    <div className="flex w-full h-[calc(100vh-80px)]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Topics</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {mindMapNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => toggleComplete(node.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                    completedItems.has(node.id)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {completedItems.has(node.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        completedItems.has(node.id)
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {node.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 relative">
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
          >
            Show Topics List
          </button>
        )}
      <div className="w-full h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.05}
        maxZoom={1.2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => (node.data.isCompleted ? '#10b981' : '#3b82f6')}
          maskColor="rgb(240, 240, 240, 0.6)"
        />
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-4 m-4">
          <h3 className="font-bold text-lg mb-2">Deep Learning Roadmap</h3>
          <div className="w-56">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedCount} / {totalItems} concepts</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Click any node to mark it as completed
            </p>
          </div>
        </Panel>
      </ReactFlow>
      </div>
      </div>
    </div>
  )
}

function buildTreeLayout(
  mindMapNodes: MindMapNode[],
  completedItems: Set<string>,
  toggleComplete: (id: string) => void
): { nodes: Node<CustomNodeData>[]; edges: Edge[] } {
  const nodes: Node<CustomNodeData>[] = []
  const edges: Edge[] = []

  // Build parent-child map
  const childrenMap = new Map<string, MindMapNode[]>()
  mindMapNodes.forEach((node) => {
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, [])
      }
      childrenMap.get(node.parentId)!.push(node)
    }
  })

  // Find root node
  const rootNode = mindMapNodes.find((n) => n.parentId === null)
  if (!rootNode) return { nodes: [], edges: [] }

  // Calculate node positions using radial mind map layout
  const nodePositions = new Map<string, { x: number; y: number; level: number }>()
  
  // Categories for color coding
  const categories = [
    'neural-networks',
    'fundamentals', 
    'architectures',
    'optimization',
    'applications'
  ]

  function calculateRadialPositions(
    nodeId: string,
    angle: number,
    radius: number,
    level: number,
    angleSpan: number
  ): void {
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    
    nodePositions.set(nodeId, { x, y, level })

    const children = childrenMap.get(nodeId) || []
    if (children.length === 0) return

    // Extremely large radius increment to prevent overlap
    const radiusIncrement = 600 + (level * 150)
    const newRadius = radius + radiusIncrement
    
    // Calculate minimum angle needed based on node dimensions with large safety margin
    const nodeWidth = 150
    const nodeHeight = 50
    const effectiveSize = Math.sqrt(nodeWidth * nodeWidth + nodeHeight * nodeHeight)
    const minAngle = (effectiveSize / newRadius) * 3.0 // Triple spacing
    const totalAngleNeeded = minAngle * children.length
    
    // Always use at least the minimum needed angle
    const effectiveSpan = Math.max(angleSpan, totalAngleNeeded)
    const anglePerChild = effectiveSpan / children.length
    const startAngle = angle - effectiveSpan / 2

    children.forEach((child, idx) => {
      const childAngle = startAngle + anglePerChild * (idx + 0.5)
      const childAngleSpan = anglePerChild * 0.75
      calculateRadialPositions(child.id, childAngle, newRadius, level + 1, childAngleSpan)
    })
  }

  // Position root at center
  nodePositions.set(rootNode.id, { x: 0, y: 0, level: 0 })

  // Get first-level children and distribute them radially
  const rootChildren = childrenMap.get(rootNode.id) || []
  const angleStep = (2 * Math.PI) / rootChildren.length

  rootChildren.forEach((child, idx) => {
    const angle = idx * angleStep - Math.PI / 2 // Start from top
    const angleSpan = angleStep * 0.8
    calculateRadialPositions(child.id, angle, 600, 1, angleSpan)
  })

  console.log('Total nodes in data:', mindMapNodes.length)
  console.log('Nodes with positions:', nodePositions.size)

  // Create React Flow nodes
  mindMapNodes.forEach((node) => {
    const pos = nodePositions.get(node.id)
    if (!pos) {
      console.log('Node without position:', node.name, node.id, 'parentId:', node.parentId)
      return
    }

    // Determine category based on position in tree
    let category = 'fundamentals'
    if (pos.level === 1) {
      const rootChildren = childrenMap.get(rootNode.id) || []
      const categoryIndex = rootChildren.findIndex(c => c.id === node.id)
      if (categoryIndex >= 0) {
        category = categories[categoryIndex % categories.length]
      }
    } else {
      // Inherit category from parent's branch
      let current = node
      while (current.parentId && current.parentId !== rootNode.id) {
        const parent = mindMapNodes.find(n => n.id === current.parentId)
        if (!parent) break
        current = parent
      }
      const rootChildren = childrenMap.get(rootNode.id) || []
      const categoryIndex = rootChildren.findIndex(c => c.id === current.id)
      if (categoryIndex >= 0) {
        category = categories[categoryIndex % categories.length]
      }
    }

    nodes.push({
      id: node.id,
      type: 'custom',
      position: { x: pos.x, y: pos.y },
      data: {
        label: node.name,
        isCompleted: completedItems.has(node.id),
        onToggle: () => toggleComplete(node.id),
        category: category,
        level: pos.level,
      },
    })
  })

  // Create edges - only for nodes that have positions
  mindMapNodes.forEach((node) => {
    if (node.parentId && nodePositions.has(node.id) && nodePositions.has(node.parentId)) {
      edges.push({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#475569', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#475569',
        },
      })
    }
  })

  console.log('Created nodes:', nodes.length, 'edges:', edges.length)

  return { nodes, edges }
}