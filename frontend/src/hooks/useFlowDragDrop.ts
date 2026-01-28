import { useCallback, useRef } from 'react';
import { useReactFlow, Node, NodeDragHandler } from 'reactflow';

// 碰撞检测辅助函数
function isOverlap(nodeA: Node, nodeB: Node) {
  if (!nodeA.width || !nodeA.height || !nodeB.width || !nodeB.height) return false;
  const aCenterX = nodeA.position.x + nodeA.width / 2;
  const aCenterY = nodeA.position.y + nodeA.height / 2;
  
  const bLeft = nodeB.position.x;
  const bRight = nodeB.position.x + nodeB.width;
  const bTop = nodeB.position.y;
  const bBottom = nodeB.position.y + nodeB.height;

  return aCenterX > bLeft && aCenterX < bRight && aCenterY > bTop && aCenterY < bBottom;
}

export const useFlowDragDrop = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  takeSnapshot: () => void
) => {
  const { screenToFlowPosition } = useReactFlow();
  
  // 用 ref 记录上一帧的碰撞目标 ID，避免频繁 setState 导致卡顿
  const lastHoveredId = useRef<string | null>(null);

  // 1. 外部文件拖入 (Global Drop)
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      const newNodes: Node[] = [];
      files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          const offset = index * 20; 
          const position = screenToFlowPosition({ x: event.clientX + offset, y: event.clientY + offset });
          newNodes.push({
            id: `img-${Date.now()}-${index}`,
            type: 'imageNode',
            position,
            data: { src: url },
            width: 200, height: 200,
            style: { width: 200, height: 200 }, 
          });
        }
      });
      if (newNodes.length > 0) {
        setNodes((nds) => nds.concat(newNodes));
        takeSnapshot();
      }
    }
  }, [screenToFlowPosition, setNodes, takeSnapshot]);

  // 2. 🔥 内部节点拖动中 (实时碰撞检测)
  const onNodeDrag: NodeDragHandler = useCallback((event, node, nodes) => {
    // 只处理 ImageNode
    if (node.type !== 'imageNode') return;

    // 找到当前碰撞的 SelectorNode
    const targetNode = nodes.find(n => n.type === 'selectorNode' && isOverlap(node, n));
    const targetId = targetNode ? targetNode.id : null;

    // 只有当碰撞状态发生改变时，才更新 state (性能优化)
    if (targetId !== lastHoveredId.current) {
      setNodes(currentNodes => currentNodes.map(n => {
        if (n.type !== 'selectorNode') return n;
        
        // 如果是新目标 -> 开启高亮
        if (n.id === targetId) {
          return { ...n, data: { ...n.data, isDragOver: true } };
        }
        // 如果是旧目标 -> 关闭高亮
        if (n.id === lastHoveredId.current) {
          return { ...n, data: { ...n.data, isDragOver: false } };
        }
        return n;
      }));
      
      lastHoveredId.current = targetId;
    }
  }, [setNodes]);

  // 3. 内部节点拖动结束 (吞噬逻辑)
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // 清理高亮状态
    if (lastHoveredId.current) {
      setNodes(ns => ns.map(n => n.id === lastHoveredId.current ? { ...n, data: { ...n.data, isDragOver: false } } : n));
      lastHoveredId.current = null;
    }

    if (node.type !== 'imageNode') {
      takeSnapshot();
      return;
    }

    setNodes((currentNodes) => {
      let absorbed = false;
      const newNodes = currentNodes.map(targetNode => {
        if (targetNode.type === 'selectorNode' && isOverlap(node, targetNode)) {
          absorbed = true;
          const currentInputs = targetNode.data.inputImages || [];
          return {
            ...targetNode,
            data: { ...targetNode.data, inputImages: [...currentInputs, node.data.src], isDragOver: false } // 确保关闭高亮
          };
        }
        return targetNode;
      });

      if (absorbed) {
        return newNodes.filter(n => n.id !== node.id);
      } else {
        return newNodes;
      }
    });
    takeSnapshot();
  }, [setNodes, takeSnapshot]);

  return { onDragOver, onDrop, onNodeDrag, onNodeDragStop };
};