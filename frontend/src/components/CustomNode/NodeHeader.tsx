import React, { memo } from 'react';
import { Edit3, Layers, Circle, Link as LinkIcon, Zap } from 'lucide-react';

interface NodeHeaderProps {
  label: string;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  updateLabel: (v: string) => void;
  isBatchMode: boolean;
  toggleBatchMode: () => void;
  status: 'head' | 'body' | 'independent'; // 传入简单的状态字符串
}

export const NodeHeader = memo(({ 
  label, isEditing, setIsEditing, updateLabel, isBatchMode, toggleBatchMode, status 
}: NodeHeaderProps) => {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      {isEditing ? (
        <input 
          autoFocus className="nodrag" 
          value={label || ''} 
          onChange={(e) => updateLabel(e.target.value)} 
          onBlur={() => setIsEditing(false)} 
          onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)} 
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', width: '120px', outline: 'none' }} 
        />
      ) : (
        <div onDoubleClick={() => setIsEditing(true)} style={{fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'text', color: 'var(--text-primary)'}}>
          {label || 'Node'} <Edit3 size={12} style={{opacity:0.5}}/>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '6px' }}>
        {status === 'body' && (
          <div title="Connected (Locked)" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <LinkIcon size={10} />
          </div>
        )}
        {status === 'head' && (
          <div title="Flow Head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <Zap size={10} fill="currentColor" />
          </div>
        )}

        <div onClick={toggleBatchMode} className="nodrag" style={{ 
          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '600',
          background: isBatchMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)', 
          padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', 
          border: isBatchMode ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.1)', 
          color: isBatchMode ? 'var(--accent-blue)' : 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}>
          {isBatchMode ? <Layers size={12}/> : <Circle size={10}/>}
          {isBatchMode ? 'BATCH' : 'SINGLE'}
        </div>
      </div>
    </div>
  );
});