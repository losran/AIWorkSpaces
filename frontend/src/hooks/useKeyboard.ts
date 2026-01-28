import { useEffect, useState, useCallback } from 'react';
import { useReactFlow, Node, Edge } from 'reactflow';

export const useKeyboard = (
  undo: () => void,
  redo: () => void,
  onSave: () => void,
  setNodes: any,
  getNodes: any,
  takeSnapshot: any
) => {
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框内的操作
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const ctrl = e.metaKey || e.ctrlKey;

      // Undo / Redo
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((ctrl && e.shiftKey && e.key === 'z') || (ctrl && e.key === 'y')) { e.preventDefault(); redo(); }

      // Save
      if (ctrl && e.key === 's') { e.preventDefault(); onSave(); }

      // Copy
      if (ctrl && e.key === 'c') {
        const selected = getNodes().filter((n: Node) => n.selected);
        if (selected.length) setCopiedNodes(selected);
      }

      // Paste
      if (ctrl && e.key === 'v' && copiedNodes.length) {
        const newNodes = copiedNodes.map((x) => ({
          ...x,
          id: `paste-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          position: { x: x.position.x + 50, y: x.position.y + 50 },
          selected: true,
          data: { ...x.data, outputImages: [], isLinked: false } // 粘贴出来的是新的，默认自由
        }));
        
        setNodes((ns: Node[]) => ns.map(x => ({ ...x, selected: false })).concat(newNodes));
        takeSnapshot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onSave, copiedNodes, getNodes, setNodes, takeSnapshot]);
};