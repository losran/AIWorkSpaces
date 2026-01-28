import React, { memo } from 'react';
import { NodeResizer } from 'reactflow';

// 纯图片节点：没有 Handle，只有一个 Resizer 和图片
export default memo(({ data, selected }: any) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      borderRadius: '12px',
      overflow: 'hidden',
      border: selected ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
      boxShadow: selected ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
      background: '#000',
      transition: 'all 0.2s'
    }}>
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={100} 
      />
      
      {data.src ? (
        <img 
          src={data.src} 
          alt="canvas-img" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          draggable={false} // 防止原生图片拖拽干扰 ReactFlow 拖拽
        />
      ) : (
        <div style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          No Image
        </div>
      )}
    </div>
  );
});