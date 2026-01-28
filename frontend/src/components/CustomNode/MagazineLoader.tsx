import React, { memo } from 'react';
import { Layers, Image as ImageIcon } from 'lucide-react';

interface MagazineLoaderProps {
  images: string[]; // 👈 传入排队的图片数组
  visible: boolean;
}

export const MagazineLoader = memo(({ images, visible }: MagazineLoaderProps) => {
  return (
    <div className={`magazine-loader ${visible ? 'visible' : ''}`}>
      {/* 左侧：计数器 */}
      <div className="magazine-status">
        <Layers size={14} color="#fbbf24" style={{ marginRight: '6px' }} />
        <span style={{ fontWeight: 800 }}>Queue:{images.length}</span>
      </div>

      {/* 右侧：缩略图传送带 */}
      <div className="magazine-strip">
        {images.map((src, i) => (
          <div key={i} className="magazine-thumb">
            <img src={src} alt="queued" />
          </div>
        ))}
        {images.length === 0 && (
          <div style={{ opacity: 0.5, fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            EMPTY
          </div>
        )}
      </div>
    </div>
  );
});