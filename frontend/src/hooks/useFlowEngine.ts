import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export const useFlowEngine = () => {
  const { setNodes } = useReactFlow();

  // 🏃 运行逻辑
  const runFlowSequence = useCallback(async (nodeId: string) => {
    
    // 1. 🚀 启动：设置状态为 running
    setNodes(nodes => nodes.map(node => {
      if (node.id === nodeId) {
        return { 
          ...node, 
          data: { ...node.data, status: 'running' } 
        };
      }
      return node;
    }));

    // 2. ⏳ 模拟计算：假装跑了 2 秒钟
    // 真实项目中这里会 fetch 后端 API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. ✅ 完成：生成结果
    setNodes(nodes => nodes.map(node => {
      if (node.id === nodeId) {
        const inputs = node.data.inputImages || [];
        
        // 模拟生成逻辑：
        // 如果有输入图，就“处理”这些图（这里简单复制一下作为结果演示）
        // 如果没输入图，就给一张默认的 AI 生成图占位
        const mockResult = inputs.length > 0 
          ? [...inputs] // 把输入图当作结果吐出来
          : ['https://placehold.co/1024x1024/3b82f6/white?text=AI+Result']; 

        return { 
          ...node, 
          data: { 
            ...node.data, 
            status: 'idle', // 跑完了，变回待机
            // 把新结果追加到 outputImages 里
            outputImages: [...(node.data.outputImages || []), ...mockResult]
          } 
        };
      }
      return node;
    }));

  }, [setNodes]);

  return { runFlowSequence };
};