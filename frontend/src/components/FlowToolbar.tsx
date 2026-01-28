import React, { memo } from 'react';
import { Panel } from 'reactflow';
import { Plus, Undo, Redo, Save, Upload } from 'lucide-react';

interface FlowToolbarProps {
  onAdd: () => void;
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const FlowToolbar = memo(({ onAdd, onSave, onLoad, onUndo, onRedo }: FlowToolbarProps) => {
  const btnStyle: React.CSSProperties = { 
    background: 'rgba(30,30,30,0.6)', backdropFilter: 'blur(10px)', color: '#eee', 
    border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer' 
  };

  const btnStylePrimary: React.CSSProperties = {
    ...btnStyle, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
  };

  return (
    <Panel position="top-left" style={{ margin: '20px', display: 'flex', gap: '8px' }}>
      <button onClick={onAdd} className="panel-btn glass-btn" style={btnStylePrimary}>
        <Plus size={16} /> New
      </button>
      
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>
      
      <button onClick={onSave} title="Save" style={btnStyle}><Save size={16} /></button>
      <button onClick={onLoad} title="Load" style={btnStyle}><Upload size={16} /></button>
      
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>
      
      <button onClick={onUndo} style={btnStyle}><Undo size={16} /></button>
      <button onClick={onRedo} style={btnStyle}><Redo size={16} /></button>
    </Panel>
  );
});