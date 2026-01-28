"use client";
import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  addEdge, Background, applyNodeChanges, applyEdgeChanges, 
  ReactFlowProvider, useReactFlow, Connection,
  useNodesState, useEdgesState, OnNodesChange, OnEdgesChange, SelectionMode, BackgroundVariant, Node
} from 'reactflow';
import 'reactflow/dist/style.css';

// 组件
import CustomNode from '../components/CustomNode';
import ImageNode from '../components/ImageNode';
import { ApiDashboard } from '../components/ApiDashboard';
import { FlowToolbar } from '../components/FlowToolbar';

// Hooks (全都各司其职)
import { useFlowHistory } from '../hooks/useFlowHistory';
import { useFlowEngine } from '../hooks/useFlowEngine';
import { useKeyboard } from '../hooks/useKeyboard';
import { useFlowLogic } from '../hooks/useFlowLogic';
import { useFlowPersistence } from '../hooks/useFlowPersistence';
import { useFlowOperations } from '../hooks/useFlowOperations';
import { useFlowDragDrop } from '../hooks/useFlowDragDrop'; // 👈 新引入的物理引擎
import { FlowProvider } from '../contexts/FlowContext';

const flowStyles = { background: 'transparent', width: '100%', height: '100%' };

const initialNodes: Node[] = [
  {
    id: `node-${Date.now()}`, 
    type: 'selectorNode',
    position: { x: 400, y: 200 }, 
    width: 400, height: 300, style: { width: 400, height: 300 },
    data: { label: 'Start Node', prompt: '', status: 'waiting', isBatchMode: true, outputImages: [], loopCount: 0, isLinked: false },
  },
];

function Flow() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);
  
  const { getNodes, getEdges } = useReactFlow(); 
  
  // 1. 逻辑与计算
  useFlowLogic(nodes, edges, setNodes);
  const { runFlowSequence } = useFlowEngine(); 

  // 2. 状态管理
  const { takeSnapshot, undo, redo } = useFlowHistory(initialNodes, getNodes, getEdges, setNodes, setEdges);
  const { onSave, onLoad } = useFlowPersistence(setNodes, setEdges, takeSnapshot);
  
  // 3. 交互与操作
  const { createNewNode, handleAltDragDuplicate } = useFlowOperations(setNodes, takeSnapshot);
  // 🔥 新 Hook：接管所有拖拽物理交互
  const { onDragOver, onDrop, onNodeDrag, onNodeDragStop } = useFlowDragDrop(setNodes, takeSnapshot);

  // 4. 全局监听
  useKeyboard(undo, redo, onSave, setNodes, getNodes, takeSnapshot);

  // --- Callbacks ---
  const onNodesChangeWrapper: OnNodesChange = useCallback((c) => { 
    setNodes((n) => applyNodeChanges(c, n)); 
    if (c.some(x => x.type === 'remove' || x.type === 'add' || x.type === 'dimensions')) takeSnapshot(); 
  }, [setNodes, takeSnapshot]);

  const onEdgesChangeWrapper: OnEdgesChange = useCallback((c) => { 
    setEdges((e) => applyEdgeChanges(c, e)); 
    if (c.some(x => x.type === 'remove' || x.type === 'add')) takeSnapshot(); 
  }, [setEdges, takeSnapshot]);

  const onConnectWrapper = useCallback((p: Connection) => { 
    setEdges((e) => addEdge(p, e)); takeSnapshot(); 
  }, [setEdges, takeSnapshot]);

  const updateNodeData = useCallback((id: string, d: any) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, ...d } } : n));
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({ 
    selectorNode: (props: any) => (
      <CustomNode {...props} data={{ ...props.data, onStartFlow: (id: string) => runFlowSequence(id), updateNode: updateNodeData }} />
    ),
    imageNode: ImageNode 
  }), [updateNodeData, runFlowSequence]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', backgroundColor: '#121212' }}>
      <ApiDashboard />
      <ReactFlow
        nodes={nodes} edges={edges} 
        onNodesChange={onNodesChangeWrapper} 
        onEdgesChange={onEdgesChangeWrapper} 
        onConnect={onConnectWrapper} 
        
        // 事件绑定：极其清爽
        onNodeDrag={onNodeDrag} // 👈 新增这行
        onNodeDragStop={onNodeDragStop} 
        onNodeDragStart={handleAltDragDuplicate}
        onDragOver={onDragOver}
        onDrop={onDrop}
        

        nodeTypes={nodeTypes} 
        fitView 
        style={flowStyles} 
        deleteKeyCode={['Backspace', 'Delete']}
        selectionOnDrag={true} 
        panOnDrag={[1, 2]} 
        selectionMode={SelectionMode.Partial}
        snapToGrid={false} 
      >
        <Background variant={BackgroundVariant.Lines} color="rgba(255, 255, 255, 0.08)" gap={40} size={1} />
        <FlowToolbar onAdd={createNewNode} onSave={onSave} onLoad={onLoad} onUndo={undo} onRedo={redo} />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <Flow />
      </FlowProvider>
    </ReactFlowProvider>
  );
}