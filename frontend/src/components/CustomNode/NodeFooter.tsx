import React, { memo } from 'react';
import { Image as ImageIcon, Loader2, Play, Link as LinkIcon } from 'lucide-react';

interface NodeFooterProps {
  onAddFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRun: () => void;
  isRunning: boolean;
  runStatus: 'active' | 'locked-head' | 'locked-body'; 
}

export const NodeFooter = memo(({ onAddFiles, onRun, isRunning, runStatus }: NodeFooterProps) => {
  
  // 只有 'active' (孤狼) 状态且没在跑的时候，才能点底部按钮
  // 龙头 (locked-head) 必须去点侧边栏，所以这里也是不可点的
  const isClickable = !isRunning && runStatus === 'active';
  
  const getButtonStyle = () => {
    // 运行中
    if (isRunning) return { bg: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'wait' };
    
    // 🔵 孤狼：唯一亮起的按钮
    if (runStatus === 'active') {
        return { bg: '#3b82f6', color: '#fff', cursor: 'pointer', shadow: '0 2px 10px rgba(59, 130, 246, 0.4)' };
    }
    
    // ⚪️ 锁定状态 (龙头 OR 小弟)：全部变灰，禁止误触
    return { bg: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' };
  };

  const style = getButtonStyle();

  const getButtonLabel = () => {
    if (isRunning) return <><Loader2 size={14} className="animate-spin"/> RUNNING</>;
    
    // 🔵 孤狼
    if (runStatus === 'active') return <><Play size={14} fill="white" /> RUN</>;
    
    // ⚪️ 龙头：明确告诉用户“去按侧边栏”
    if (runStatus === 'locked-head') return 'USE SIDEBAR';
    
    // ⚪️ 小弟
    return <><LinkIcon size={12} /> LINKED</>;
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', padding: '0 16px 16px 16px' }}>
      <label style={{ 
        flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', 
        padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', 
        fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'all 0.2s', border: '1px solid transparent'
      }} 
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} 
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'transparent'; }}>
          <ImageIcon size={14} /> Add Files
          <input type="file" multiple accept="image/*" className="nodrag" onChange={onAddFiles} style={{ display: 'none' }} />
      </label>
      
      <button 
        className="nodrag" 
        onClick={isClickable ? onRun : undefined}
        disabled={!isClickable}
        style={{ 
          flex: 1, 
          background: style.bg, 
          color: style.color,
          border: '1px solid rgba(255,255,255,0.05)', 
          padding: '10px', borderRadius: '8px', 
          fontSize: '12px', fontWeight: '600', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
          cursor: style.cursor,
          transition: 'all 0.2s',
          boxShadow: style.shadow || 'none'
      }}
      >
        {getButtonLabel()}
      </button>
    </div>
  );
});