import React, { memo, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { Handle, Position, NodeResizer, useEdges } from 'reactflow'; 
import { X, Download } from 'lucide-react'; 
import { ImageGallery } from './ImageGallery';
import { TaskQueue } from './TaskQueue';
import { StartLabel } from './StartLabel';
import { useNodeController } from './useNodeController';
import { MagazineLoader } from './MagazineLoader';
import { NodeHeader } from './NodeHeader';
import { NodeBody } from './NodeBody';
import { NodeFooter } from './NodeFooter';
import './styles.css';

// 🔥 极简弹窗预览 (Minimal Lightbox)
const FullScreenPreview = ({ src, onClose }: { src: string, onClose: () => void }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="nodrag"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        // 背景稍微暗一点点，不需要太黑
        background: 'rgba(0,0,0,0.4)', 
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {/* 弹窗容器：相对定位，包裹图片和按钮 */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ position: 'relative', maxWidth: '80vw', maxHeight: '80vh' }}
      >
        <img 
          src={src} 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '80vh', 
            objectFit: 'contain', 
            borderRadius: '8px', 
            // 加上阴影，让它像个浮窗
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'block'
          }} 
        />
        
        {/* 🔥 极简工具栏：悬浮在图片右上角 */}
        <div style={{ 
          position: 'absolute', 
          top: '-40px', // 放在图片上方外面，或者 top: 10px 放在里面
          right: '0', 
          display: 'flex', 
          gap: '12px',
        }}>
          {/* 下载图标 (纯icon) */}
          <a 
            href={src} 
            download={`image-${Date.now()}.png`}
            title="Download"
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          >
            <Download size={20} />
          </a>

          {/* 关闭图标 (纯icon) */}
          <div 
            onClick={onClose}
            title="Close"
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          >
            <X size={20} />
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default memo(({ data, id, selected }: any) => {
  const ctrl = useNodeController(data, id);
  const edges = useEdges();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { isHead, isBody, isIndependent } = useMemo(() => {
    const isTarget = edges.some(e => e.target === id);
    const isSource = edges.some(e => e.source === id);
    const isLinked = !!data.isLinked; 
    return { isIndependent: !isTarget && !isSource, isHead: !isLinked && isSource, isBody: isLinked };
  }, [edges, id, data.isLinked]);

  const isActiveDrag = ctrl.isDragOver || data.isDragOver;

  let magazineImages: string[] = [];
  if (ctrl.isBatchMode && ctrl.inputImages.length > 1) {
    magazineImages = ctrl.inputImages.slice(1);
  }

  return (
    <>
      <div className="custom-node-wrapper">
        <NodeResizer color="#3b82f6" isVisible={selected} minWidth={300} minHeight={200} handleStyle={{}} />
        <Handle type="target" position={Position.Left} style={{ left: '-6px', zIndex: 50 }} />
        <Handle type="source" position={Position.Right} style={{ right: '-6px', zIndex: 50 }} />

        <MagazineLoader images={magazineImages} visible={magazineImages.length > 0} />
        {isHead && <StartLabel isRunning={ctrl.isRunning} onClick={ctrl.handleFlowRun} />}

        <div 
          className={`glass-panel ${selected ? 'selected' : ''} ${isActiveDrag ? 'drag-over-active' : ''}`}
          onDragEnter={ctrl.handleDragEnter} onDragLeave={ctrl.handleDragLeave} onDragOver={ctrl.handleDragOver} onDrop={ctrl.handleDrop}
          style={{ borderRadius: '12px', width: '100%', height: '100%', position: 'relative', zIndex: 10 }}
        >
          <NodeHeader 
            label={data.label} isEditing={ctrl.isEditingTitle} setIsEditing={ctrl.setIsEditingTitle} updateLabel={(v) => ctrl.updateSelf({ label: v })}
            isBatchMode={ctrl.isBatchMode} toggleBatchMode={ctrl.toggleBatchMode} status={isHead ? 'head' : (isBody ? 'body' : 'independent')}
          />

          <NodeBody 
            prompt={data.prompt} onPromptChange={ctrl.handlePromptChange}
            inputImages={ctrl.inputImages} isBatchMode={ctrl.isBatchMode} 
            onDeleteImage={ctrl.handleDeleteImage} 
            currentPreview={ctrl.currentPreview}
            onViewImage={setPreviewImage} 
          />

          <NodeFooter onAddFiles={ctrl.handleFileChange} onRun={ctrl.handleFlowRun} isRunning={ctrl.isRunning} runStatus={isIndependent ? 'active' : (isHead ? 'locked-head' : 'locked-body')} />
        </div>

        <ImageGallery images={ctrl.outputImages} />
      </div>

      {previewImage && <FullScreenPreview src={previewImage} onClose={() => setPreviewImage(null)} />}
    </>
  );
});