import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface StartLabelProps {
  isRunning: boolean;
  onClick: (e: any) => void;
}

export const StartLabel: React.FC<StartLabelProps> = ({ isRunning, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="nodrag group"
      style={{
        position: 'absolute', left: '-24px', top: '12px', bottom: 'auto', height: 'auto', width: '24px', padding: '10px 0',
        background: isRunning 
            ? 'rgba(40, 40, 40, 0.8)' 
            : '#3b82f6', // 纯正的品牌蓝
        color: 'white', 
        borderRadius: '4px 0 0 4px',
        fontSize: '10px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        zIndex: 10, cursor: isRunning ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: isRunning ? 'none' : '-2px 0 8px rgba(59, 130, 246, 0.3)'
      }}
    >
      {isRunning ? <Loader2 size={12} className="animate-spin" style={{opacity:0.7}}/> : <Play size={12} fill="white" />}
      <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '1px', fontSize: '9px', opacity: 0.9 }}>
        {isRunning ? 'RUN' : 'START'}
      </span>
    </div>
  );
};