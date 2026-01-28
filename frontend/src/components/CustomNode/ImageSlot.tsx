import React, { memo } from 'react';

interface ImageSlotProps {
  src: string;
  onView: () => void;
  onDelete: () => void;
}

export const ImageSlot = memo(({ src, onView, onDelete }: ImageSlotProps) => {
  return (
    <div 
      className="image-slot-wrapper"
      onClick={(e) => { e.stopPropagation(); onView(); }} 
      style={{ width: '64px', height: '64px', flexShrink: 0 }}
    >
      <div className="image-slot-inner">
        <img 
          src={src} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />
      </div>
      
      {/* 极简红点 */}
      <div 
        className="delete-badge" 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      />
    </div>
  );
});