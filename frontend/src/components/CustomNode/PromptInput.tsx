import React, { memo } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PromptInput = memo(({ value, onChange }: PromptInputProps) => {
  return (
    <textarea 
      // 🔥 使用刚刚定义的 CSS 类
      className="prompt-input-area nodrag no-scrollbar" 
      placeholder="在此输入提示词 (Enter prompt here)..." 
      value={value || ''} 
      onChange={onChange} 
      // 没有任何 style 属性了，舒服
    />
  );
});