import { useState, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export const useNodeController = (data: any, id: string) => {
  const { setNodes } = useReactFlow();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isBatchMode = data.isBatchMode !== false; 
  const isRunning = data.status === 'running';
  
  // 📥 输入队列 (Input Images) - 也就是弹匣里的子弹
  const inputImages: string[] = data.inputImages || [];
  
  // 📤 输出结果 (Output Images) - 也就是挂在下面的生成图
  const outputImages: string[] = data.outputImages || [];

  // 预览图逻辑：显示最新的生成图，如果没有生成图，就显示正在处理的输入图
  const currentPreview = outputImages.length > 0 ? outputImages[outputImages.length - 1] : null;

  const updateSelf = useCallback((updates: any) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, ...updates } };
      }
      return n;
    }));
  }, [setNodes, id]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSelf({ prompt: e.target.value });
  }, [updateSelf]);

  const toggleBatchMode = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    updateSelf({ isBatchMode: !isBatchMode });
  }, [updateSelf, isBatchMode]);

  const handleFlowRun = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (data.onStartFlow) {
      data.onStartFlow(id); 
    }
  }, [data, id]);

  // ♻️ 处理文件：把图片塞进 Input 队列 (弹匣)
  const processFiles = useCallback((files: FileList | File[]) => {
    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }
    });

    if (newImages.length > 0) {
      // ⚠️ 关键：是塞进 inputImages (输入弹匣)，不是 output
      updateSelf({ inputImages: [...inputImages, ...newImages] });
    }
  }, [inputImages, updateSelf]);

  // 🗑️ 删除某张图片
  const handleDeleteImage = useCallback((indexToDelete: number) => {
    const newQueue = inputImages.filter((_, index) => index !== indexToDelete);
    updateSelf({ inputImages: newQueue });
  }, [inputImages, updateSelf]);

  // 📂 按钮上传
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
    e.target.value = '';
  }, [processFiles]);

  // 🖱️ 拖拽逻辑
  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { 
    e.preventDefault(); e.stopPropagation(); 
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false); 
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  return {
    isEditingTitle, setIsEditingTitle,
    isBatchMode, isRunning, isDragOver,
    currentPreview,
    
    inputImages, // 👈 暴露输入弹匣
    outputImages, // 👈 暴露输出结果
    
    updateSelf, handlePromptChange, toggleBatchMode, handleFlowRun, handleFileChange,
    handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
    handleDeleteImage // 👈 暴露删除方法
  };
};