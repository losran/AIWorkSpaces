import React from 'react';
import { Activity, CheckCircle2, XCircle, DollarSign, Zap } from 'lucide-react';
import { useFlowStats } from '../contexts/FlowContext';

export const ApiDashboard = () => {
  const { stats } = useFlowStats();

  // 假设一次 API 调用大概 0.002 刀 (Gemini Flash 价格)
  const cost = (stats.totalCalls * 0.002).toFixed(4);
  const estimatedTotalCost = (stats.estimatedCost * 0.002).toFixed(4);

  return (
    <div className="nodrag" style={{
      position: 'absolute', top: '20px', right: '20px',
      background: 'rgba(18, 18, 18, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: '#fff',
      display: 'flex', flexDirection: 'column', gap: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      zIndex: 100, minWidth: '200px'
    }}>
      {/* 标题栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '12px', color: '#a1a1a1' }}>
          <Activity size={14} color="#3b82f6" /> SYSTEM MONITOR
        </div>
        <div style={{ fontSize: '10px', color: stats.pending > 0 ? '#fbbf24' : '#10b981' }}>
          {stats.pending > 0 ? 'PROCESSING' : 'IDLE'}
        </div>
      </div>

      {/* 核心数据 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* 实时消耗 */}
        <div>
           <div style={{fontSize: '10px', color:'#888', marginBottom:'2px'}}>Real-time Cost</div>
           <div style={{fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', color: '#fff', display:'flex', alignItems:'center'}}>
             <DollarSign size={12} className="text-green-500"/> {cost}
           </div>
           <div style={{fontSize: '9px', color:'#555'}}>Calls: {stats.totalCalls}</div>
        </div>

        {/* 预测消耗 */}
        <div>
           <div style={{fontSize: '10px', color:'#888', marginBottom:'2px'}}>Predicted Load</div>
           <div style={{fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', color: stats.estimatedCost > 50 ? '#ef4444' : '#3b82f6', display:'flex', alignItems:'center'}}>
             <Zap size={12} fill="currentColor"/> {stats.estimatedCost}
           </div>
           <div style={{fontSize: '9px', color:'#555'}}>Est. Cost: ${estimatedTotalCost}</div>
        </div>
      </div>

      {/* 状态条 */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={12} color="#10b981" />
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}>{stats.success}</span>
        </div>
        <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <XCircle size={12} color="#ef4444" />
            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '600' }}>{stats.failed}</span>
        </div>
      </div>
    </div>
  );
};