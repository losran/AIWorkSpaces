import { useCallback } from 'react';
import { Node, NodeDragHandler } from 'reactflow';

export const useFlowOperations = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>, 
  takeSnapshot: () => void
) => {
  
  const createNewNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`, 
      type: 'selectorNode', 
      position: { x: 500, y: 300 },
      data: { label: 'Task Node', prompt: '', status: 'waiting', outputImages: [], loopCount: 0, isLinked: false }, 
      width: 400, 
      height: 300, 
      style: { width: 400, height: 300 }
    };
    setNodes((nds) => [...nds, newNode]);
    takeSnapshot();
  }, [setNodes, takeSnapshot]);

  // 👯 增强版复制：支持 ImageNode
  const handleAltDragDuplicate: NodeDragHandler = useCallback((e, n) => {
    if (e.altKey) { 
      const copy: Node = { 
        ...n, 
        id: `${n.type === 'imageNode' ? 'img' : 'node'}-${Date.now()}`, // 区分 ID 前缀
        selected: false, 
        dragging: false, 
        position: { ...n.position }, 
        // 复制数据，重置状态
        data: { ...n.data, status: 'waiting', isLinked: false } 
      };
      setNodes((ns) => [copy, ...ns]);
    }
  }, [setNodes]);

  return { createNewNode, handleAltDragDuplicate };
};