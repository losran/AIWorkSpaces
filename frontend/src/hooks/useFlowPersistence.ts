import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export const useFlowPersistence = (
  setNodes: any, 
  setEdges: any, 
  takeSnapshot: () => void
) => {
  const { toObject, setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem('ai-watch-flow-key', JSON.stringify(flow));
    alert("✅ 弹夹配置已保存 (.mag)");
  }, [toObject]);

  const onLoad = useCallback(() => {
    const flowString = localStorage.getItem('ai-watch-flow-key');
    if (flowString) {
      const flow = JSON.parse(flowString);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
      
      // 加载完后记录一次快照，防止 Undo 错乱
      setTimeout(takeSnapshot, 0);
    }
  }, [setNodes, setEdges, setViewport, takeSnapshot]);

  return { onSave, onLoad };
};