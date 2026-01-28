import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="nodrag" style={{ position: 'absolute', top: '100%', left: 0, right: 0, paddingTop: '8px', zIndex: 5 }}>
      <motion.div 
        layout 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}
      >
        <AnimatePresence initial={false}>
          {[...images].reverse().map((imgSrc, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={imgSrc.length + index} // 实际生产建议用 unique ID
              className="image-card"
              style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', background: '#000' }}
            >
              <img src={imgSrc} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" alt="generated" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};