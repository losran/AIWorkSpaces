import React, { memo } from 'react';
import { PromptInput } from './PromptInput'; // 👈 引入新组件
import { ImageSlot } from './ImageSlot';     // 👈 引入新组件

interface NodeBodyProps {
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputImages: string[];
  isBatchMode: boolean;
  onDeleteImage: (index: number) => void;
  onViewImage: (src: string) => void;
  currentPreview?: string | null; 
}

export const NodeBody = memo(({ prompt, onPromptChange, inputImages, isBatchMode, onDeleteImage, onViewImage }: NodeBodyProps) => {
  
  // 逻辑层：计算要显示的图片
  let displayImages: string[] = [];
  // 如果是 Batch 模式且有图，只取第 1 张；否则显示全部
  // 注意：这里需要保留原始 index 吗？
  // 为了删除方便，我们最好不要在这里 slice 原始数组，而是做个映射
  // 但为了简单，Single 模式我们直接遍历 inputImages
  
  // 这里有个小技巧：Batch模式我们其实只想渲染 inputImages[0]
  // 但为了 map 循环的统一，我们可以构造一个临时数组
  const renderList = (isBatchMode && inputImages.length > 0) 
    ? [{ src: inputImages[0], originalIndex: 0 }] 
    : inputImages.map((src, i) => ({ src, originalIndex: i }));

  return (
    <div className="no-scrollbar nodrag" style={{ 
      padding: '16px', 
      display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, 
      overflowY: 'auto', width: '100%', height: '100%', boxSizing: 'border-box' 
    }}>
      
      {/* 1. Prompt 输入区域 */}
      <PromptInput value={prompt} onChange={onPromptChange} />
      
      {/* 2. 图片展示区域 */}
      {renderList.length > 0 && (
        <div className="nodrag" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px', 
          width: '100%', 
          paddingTop: '8px', 
          paddingRight: '8px'
        }}>
          {renderList.map((item) => (
            <ImageSlot 
              key={`${item.originalIndex}-${item.src}`} // 确保 key 唯一且稳定
              src={item.src}
              onView={() => onViewImage(item.src)}
              onDelete={() => onDeleteImage(item.originalIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
});