import React, { createContext, useContext, useState, useCallback } from 'react';

interface FlowStats {
  totalCalls: number;
  success: number;
  failed: number;
  pending: number;
  estimatedCost: number; // 预测消耗
}

interface FlowContextType {
  stats: FlowStats;
  incrementCall: () => void;
  incrementSuccess: () => void;
  incrementFail: () => void;
  setPending: (n: number) => void;
  setEstimatedCost: (n: number) => void;
  resetStats: () => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<FlowStats>({
    totalCalls: 0,
    success: 0,
    failed: 0,
    pending: 0,
    estimatedCost: 0,
  });

  const incrementCall = useCallback(() => setStats(s => ({ ...s, totalCalls: s.totalCalls + 1, pending: s.pending + 1 })), []);
  const incrementSuccess = useCallback(() => setStats(s => ({ ...s, success: s.success + 1, pending: Math.max(0, s.pending - 1) })), []);
  const incrementFail = useCallback(() => setStats(s => ({ ...s, failed: s.failed + 1, pending: Math.max(0, s.pending - 1) })), []);
  const setPending = useCallback((n: number) => setStats(s => ({ ...s, pending: n })), []);
  const setEstimatedCost = useCallback((n: number) => setStats(s => ({ ...s, estimatedCost: n })), []);
  const resetStats = useCallback(() => setStats(s => ({ ...s, totalCalls: 0, success: 0, failed: 0, pending: 0 })), []);

  return (
    <FlowContext.Provider value={{ stats, incrementCall, incrementSuccess, incrementFail, setPending, setEstimatedCost, resetStats }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowStats = () => {
  const context = useContext(FlowContext);
  if (!context) throw new Error("useFlowStats must be used within a FlowProvider");
  return context;
};