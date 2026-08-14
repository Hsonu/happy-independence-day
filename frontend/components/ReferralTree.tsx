'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  Node,
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode } from '@/types';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';
import { X } from 'lucide-react';

interface ReferralTreeProps {
  treeData: TreeNode | null;
}

// Custom node component
function CustomNode({ data }: { data: any }) {
  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 min-w-[150px] text-center cursor-pointer transition-all ${
        data.isRoot
          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-400 shadow-lg shadow-orange-200/50'
          : 'bg-white border-gray-200 hover:border-orange-300 shadow-md hover:shadow-lg'
      }`}
      onClick={() => data.onSelect?.(data)}
    >
      <div className="flex justify-center mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
          style={{ backgroundColor: getAvatarColor(data.name) }}
        >
          {getInitials(data.name)}
        </div>
      </div>
      <p className="font-semibold text-sm text-gray-900">
        {data.isRoot ? '🇮🇳 ' : ''}{data.name}
      </p>
      <p className="text-xs text-gray-500">Level {data.level}</p>
      <p className="text-xs text-orange-600 font-medium">{data.referralCount} Connections</p>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

function buildNodesAndEdges(
  tree: TreeNode,
  onSelect: (node: any) => void,
  x: number = 0,
  y: number = 0,
  level: number = 0,
  isRoot: boolean = true,
): { nodes: Node[]; edges: Edge[]; width: number } {
  const nodeSpacingX = 200;
  const nodeSpacingY = 150;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!tree.children || tree.children.length === 0) {
    nodes.push({
      id: tree._id,
      type: 'custom',
      position: { x, y },
      data: {
        ...tree,
        isRoot,
        onSelect,
      },
    });
    return { nodes, edges, width: nodeSpacingX };
  }

  // Calculate children positions
  const childResults = tree.children.map((child) =>
    buildNodesAndEdges(child, onSelect, 0, 0, level + 1, false)
  );

  const totalChildWidth = childResults.reduce((sum, r) => sum + r.width, 0);
  let currentX = x - totalChildWidth / 2;

  for (let i = 0; i < tree.children.length; i++) {
    const childWidth = childResults[i].width;
    const childX = currentX + childWidth / 2;
    const childY = y + nodeSpacingY;

    const childResult = buildNodesAndEdges(
      tree.children[i],
      onSelect,
      childX,
      childY,
      level + 1,
      false
    );

    nodes.push(...childResult.nodes);
    edges.push(...childResult.edges);

    edges.push({
      id: `${tree._id}-${tree.children[i]._id}`,
      source: tree._id,
      target: tree.children[i]._id,
      animated: true,
      style: { stroke: '#FF9933', strokeWidth: 2 },
    });

    currentX += childWidth;
  }

  nodes.push({
    id: tree._id,
    type: 'custom',
    position: { x, y },
    data: {
      ...tree,
      isRoot,
      onSelect,
    },
  });

  return { nodes, edges, width: Math.max(totalChildWidth, nodeSpacingX) };
}

export default function ReferralTree({ treeData }: ReferralTreeProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeSelect = useCallback((nodeData: any) => {
    setSelectedNode(nodeData);
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!treeData) return { initialNodes: [], initialEdges: [] };
    const { nodes, edges } = buildNodesAndEdges(treeData, handleNodeSelect);
    return { initialNodes: nodes, initialEdges: edges };
  }, [treeData, handleNodeSelect]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-[500px] text-gray-500">
        No network data available
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        attributionPosition="bottom-left"
      >
        <Controls className="!bg-white !border-gray-200 !shadow-lg !rounded-xl" />
        <MiniMap
          className="!bg-white !border-gray-200 !shadow-lg !rounded-xl"
          nodeColor="#FF9933"
          maskColor="rgba(0,0,0,0.1)"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        <Panel position="top-left">
          <div className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            🌳 Network Tree • Zoom & Pan to explore
          </div>
        </Panel>
      </ReactFlow>

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getAvatarColor(selectedNode.name) }}
                >
                  {getInitials(selectedNode.name)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-500">@{selectedNode.username}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Level</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedNode.level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Referral Code</span>
                <span className="font-mono font-medium text-saffron">{selectedNode.referralCode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Connections</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedNode.referralCount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedNode.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
