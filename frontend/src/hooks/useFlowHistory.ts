import { useState, useRef, useCallback, useEffect } from 'react';
import { Node, Edge, useReactFlow } from 'reactflow';

export const useFlowHistory = (
  initialNodes: Node[], 
  getNodes: () => Node[], 
  getEdges: () => Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void
) => {
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // 初始化
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes: initialNodes, edges: [] }]);
      setHistoryPointer(0);
    }
  }, []);

  const takeSnapshot = useCallback(() => {
    if (isUndoRedoAction.current) return;
    setHistory(prev => {
      const newHistory = prev.slice(0, historyPointer + 1);
      newHistory.push({ nodes: getNodes(), edges: getEdges() });
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryPointer(prev => Math.min(prev + 1, 49));
  }, [getNodes, getEdges, historyPointer]);

  const undo = useCallback(() => {
    if (historyPointer > 0) {
      isUndoRedoAction.current = true;
      const snapshot = history[historyPointer - 1];
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
      setHistoryPointer(historyPointer - 1);
      // 稍微延迟释放锁，等待 React Flow 更新完毕
      setTimeout(() => isUndoRedoAction.current = false, 100);
    }
  }, [history, historyPointer, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      isUndoRedoAction.current = true;
      const snapshot = history[historyPointer + 1];
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
      setHistoryPointer(historyPointer + 1);
      setTimeout(() => isUndoRedoAction.current = false, 100);
    }
  }, [history, historyPointer, setNodes, setEdges]);

  return { takeSnapshot, undo, redo, canUndo: historyPointer > 0, canRedo: historyPointer < history.length - 1 };
};