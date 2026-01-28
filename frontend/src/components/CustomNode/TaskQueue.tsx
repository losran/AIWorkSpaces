import React from 'react';
import { ListOrdered } from 'lucide-react';

interface TaskQueueProps {
  queuedPreviews: string[];
  isStart: boolean;
}

export const TaskQueue: React.FC<TaskQueueProps> = ({ queuedPreviews, isStart }) => {
  if (queuedPreviews.length === 0) return null;

  return (
    <div className="nodrag" style={{
      position: 'absolute',
      top: '-24px',
      left: '12px', right: '12px', height: '24px',
      background: 'rgba(30, 30, 30, 0.8)', // 深灰底
      backdropFilter: 'blur(8px)',
      borderRadius: '6px 6px 0 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)', // 亮边
      borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex', alignItems: 'center', padding: '0 8px', gap: '6px',
      fontSize: '10px', color: '#a1a1a1', zIndex: 5
    }}>
      <ListOrdered size={10} color="#3b82f6" />
      <span style={{ color: '#3b82f6', fontWeight: '600' }}>Queue: {queuedPreviews.length}</span>
      <div style={{ display: 'flex', gap: '-4px', marginLeft: 'auto' }}>
        {queuedPreviews.slice(0, 5).map((src, i) => (
          <img key={i} src={src} style={{ 
            width: '16px', height: '16px', borderRadius: '50%',
            objectFit: 'cover', border: '1px solid #222',
            marginLeft: i > 0 ? '-4px' : '0',
            zIndex: 5 - i
          }} />
        ))}
        {queuedPreviews.length > 5 && <span style={{marginLeft: '4px', fontSize:'9px'}}>...</span>}
      </div>
    </div>
  );
};