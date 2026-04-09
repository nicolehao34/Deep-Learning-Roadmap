import { Handle, Position, type Node, type Edge, MarkerType } from 'reactflow'
import { CheckCircle2, Circle } from 'lucide-react'
import React from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

export const NODE_WIDTH = 180
export const NODE_HEIGHT = 32
export const H_GAP = 90
export const V_GAP = 6

export const CATEGORY_KEYS = [
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

export const categoryColors: Record<string, string> = {
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

// ─── Node Data Interface ──────────────────────────────────────────────────────

export interface CustomNodeData {
  label: string
  isCompleted: boolean
  completionRatio: number
  onToggle: () => void
  category: string
  level: number
  side: 'left' | 'right' | 'root'
}

// ─── Node Components ──────────────────────────────────────────────────────────

export function RootNode({ data }: { data: CustomNodeData }) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Handle, { type: 'source', id: 'right', position: Position.Right, style: { opacity: 0 } }),
    React.createElement(Handle, { type: 'source', id: 'left', position: Position.Left, style: { opacity: 0 } }),
    React.createElement(
      'div',
      {
        className: 'px-6 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-center select-none min-w-[160px]',
      },
      React.createElement('div', { className: 'text-white font-bold text-xl leading-tight' }, data.label)
    )
  )
}

export function CategoryNode({ data }: { data: CustomNodeData }) {
  const color = categoryColors[data.category] ?? '#6b7280'
  const isLeft = data.side === 'left'
  const ratio = data.completionRatio
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Handle, {
      type: 'target',
      position: isLeft ? Position.Right : Position.Left,
      style: { opacity: 0 },
    }),
    React.createElement(
      'div',
      {
        className: 'px-4 py-1.5 rounded-full font-bold text-sm text-white shadow-md select-none min-w-[100px] text-center',
        style: {
          backgroundColor: color,
          filter: `grayscale(${(1 - ratio) * 100}%)`,
          opacity: 0.3 + ratio * 0.7,
          boxShadow: ratio > 0 ? `0 0 ${Math.round(ratio * 14)}px ${color}55` : undefined,
          transition: 'filter 0.7s ease, opacity 0.7s ease, box-shadow 0.7s ease',
        },
      },
      data.label
    ),
    React.createElement(Handle, {
      type: 'source',
      position: isLeft ? Position.Left : Position.Right,
      style: { opacity: 0 },
    })
  )
}

export function TopicNode({ data }: { data: CustomNodeData }) {
  const color = categoryColors[data.category] ?? '#6b7280'
  const isLeft = data.side === 'left'
  const done = data.isCompleted
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Handle, {
      type: 'target',
      position: isLeft ? Position.Right : Position.Left,
      style: { opacity: 0 },
    }),
    React.createElement(
      'div',
      {
        className: 'px-2.5 py-1 rounded-md border text-xs max-w-[180px]',
        style: {
          borderColor: done ? color : '#e5e7eb',
          backgroundColor: done ? `${color}12` : '#f8fafc',
          filter: done ? 'grayscale(0%)' : 'grayscale(100%)',
          opacity: done ? 1 : 0.45,
          boxShadow: done ? `0 0 8px ${color}35` : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'filter 0.6s ease, opacity 0.6s ease, box-shadow 0.6s ease, border-color 0.5s ease, background-color 0.5s ease',
        },
      },
      React.createElement(
        'div',
        { className: `flex items-center gap-1.5 ${isLeft ? 'flex-row-reverse' : ''}` },
        React.createElement(
          'button',
          { onClick: data.onToggle, className: 'flex-shrink-0 transition-transform hover:scale-110' },
          done
            ? React.createElement(CheckCircle2, { className: 'w-3.5 h-3.5', style: { color } })
            : React.createElement(Circle, { className: 'w-3.5 h-3.5 text-gray-300' })
        ),
        React.createElement(
          'span',
          {
            className: `leading-snug ${isLeft ? 'text-right' : 'text-left'} ${
              done ? 'font-medium text-gray-800' : 'text-gray-400'
            }`,
          },
          data.label
        )
      )
    ),
    React.createElement(Handle, {
      type: 'source',
      position: isLeft ? Position.Left : Position.Right,
      style: { opacity: 0 },
    })
  )
}

export const nodeTypes = {
  root: RootNode,
  category: CategoryNode,
  topic: TopicNode,
}

// ─── Layout Algorithm ─────────────────────────────────────────────────────────

export interface MindMapNodeInput {
  id: string
  name: string
  parentId: string | null
}

export function buildMindMapLayout(rawNodes: MindMapNodeInput[]): {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
} {
  const seen = new Set<string>()
  const uniqueNodes = rawNodes.filter((n) => {
    if (seen.has(n.id)) return false
    seen.add(n.id)
    return true
  })

  const childrenMap = new Map<string, MindMapNodeInput[]>()
  uniqueNodes.forEach((n) => {
    if (n.parentId) {
      if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, [])
      childrenMap.get(n.parentId)!.push(n)
    }
  })

  const rootNode = uniqueNodes.find((n) => n.parentId === null)
  if (!rootNode) return { nodes: [], edges: [] }

  const leafCounts = new Map<string, number>()
  function countLeaves(id: string): number {
    const children = childrenMap.get(id) ?? []
    if (children.length === 0) { leafCounts.set(id, 1); return 1 }
    const total = children.reduce((s, c) => s + countLeaves(c.id), 0)
    leafCounts.set(id, total)
    return total
  }
  countLeaves(rootNode.id)

  const categoryOf = new Map<string, string>()
  const sideOf = new Map<string, 'left' | 'right' | 'root'>()
  const l1Nodes = childrenMap.get(rootNode.id) ?? []
  l1Nodes.forEach((n, i) => {
    categoryOf.set(n.id, CATEGORY_KEYS[i] ?? 'neural-networks')
    sideOf.set(n.id, i % 2 === 0 ? 'right' : 'left')
  })
  sideOf.set(rootNode.id, 'root')

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

  positions.set(rootNode.id, { x: 0, y: 0, level: 0 })

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
      data: { label: node.name, isCompleted: false, completionRatio: 0, onToggle: () => {}, category, level: pos.level, side },
    })
  })

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
      data: { categoryColor: color },
      style: { stroke: color, strokeWidth, opacity: 0.15, transition: 'opacity 0.6s ease' },
      markerEnd: undefined,
    }
    if (level === 1) edge.sourceHandle = side === 'left' ? 'left' : 'right'
    edges.push(edge)
  })

  return { nodes, edges }
}
