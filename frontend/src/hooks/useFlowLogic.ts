import { useEffect } from 'react';
import { Node, Edge } from 'reactflow';

export const useFlowLogic = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (update: (nodes: Node[]) => Node[]) => void
) => {
  
  // 监听 edges 变化，同时也监听 nodes 的位置变化（虽然 nodes 变化频繁，但我们需要在拖拽后修正逻辑）
  // 为了性能，我们主要在 edges 变化时触发，或者依赖 ReactFlow 的内部状态更新
  useEffect(() => {
    setNodes((currentNodes) => {
      let hasChanges = false;

      const updatedNodes = currentNodes.map((node) => {
        // 1. 谁连了我？(Incoming Edges)
        const incomingEdges = edges.filter((e) => e.target === node.id);

        // 默认假设：没人连我，我是 Head (false)
        let isLinked = false;

        if (incomingEdges.length > 0) {
          // 2. 只有“正规军”（从左边来的线）才能压制我
          // 如果所有的输入线都是“游击队”（从右边连回来的回环线），那我不怕，我依然是 Head。
          
          const hasDominantParent = incomingEdges.some(edge => {
            const parent = currentNodes.find(n => n.id === edge.source);
            if (!parent) return false;

            // 📍 核心判决：几何位置决定地位
            // 如果父节点在我的左边 (X 坐标更小)，它是上级 -> return true (我被 Linked)
            // 如果父节点在我的右边 (X 坐标更大)，它是回流 -> return false (我忽略它)
            
            // 容差 10px，避免对齐时的抖动
            return parent.position.x < (node.position.x - 10);
          });

          // 如果有正规军压制，我就变 Linked；否则保持 Head
          isLinked = hasDominantParent;
        }

        // 只有状态不一致时才更新，避免死循环
        if (node.data.isLinked !== isLinked) {
          hasChanges = true;
          return { ...node, data: { ...node.data, isLinked } };
        }
        return node;
      });

      return hasChanges ? updatedNodes : currentNodes;
    });
    // 我们这里依赖 edges。
    // 注意：如果你发现拖动节点位置后，状态没有立即更新，是因为 position 变化没触发这个 Effect。
    // 但通常你连线的时候（edges change），逻辑会自动修正，这符合使用习惯。
  }, [edges]); 
};