import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@shared/utils/apiClient';
import { useToast } from '@shared/hooks/useToast';

const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = '拖拽图片到此处或点击上传',
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*',
  className = ''
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [inputMode, setInputMode] = useState(value && value.startsWith('http') ? 'url' : 'upload'); // 'upload' or 'url'
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async (file) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast(t('projects.imageUpload.invalidType') || '请选择图片文件', 'error');
      return;
    }

    // 验证文件大小
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);
      showToast(
        t('projects.imageUpload.fileTooLarge', { size: maxSizeMB }) || `文件大小不能超过 ${maxSizeMB}MB`,
        'error'
      );
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // 上传文件
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/files/upload', formData);

      if (response.data && response.data.url) {
        const imageUrl = response.data.url;
        setPreview(imageUrl);
        onChange?.(imageUrl);
        showToast(t('projects.imageUpload.uploadSuccess') || '图片上传成功', 'success');
      } else {
        throw new Error('Upload response missing URL');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast(
        t('projects.imageUpload.uploadError') || '图片上传失败，请重试',
        'error'
      );
      setPreview('');
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onChange, showToast, t]);

  // 处理拖拽
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // 处理点击上传
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // 重置input，允许重复选择同一文件
    e.target.value = '';
  }, [handleFileSelect]);

  // 处理URL输入
  const handleUrlChange = useCallback((e) => {
    const url = e.target.value;
    setPreview(url);
    onChange?.(url);
  }, [onChange]);

  // 清除图片
  const handleClear = useCallback((e) => {
    e.stopPropagation();
    setPreview('');
    onChange?.('');
    if (urlInputRef.current) {
      urlInputRef.current.value = '';
    }
  }, [onChange]);

  // 切换输入模式
  const handleModeSwitch = useCallback((mode) => {
    setInputMode(mode);
    if (mode === 'url' && !preview) {
      // 切换到URL模式时，清空预览
      setPreview('');
      onChange?.('');
    }
  }, [onChange, preview]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 模式切换 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeSwitch('upload')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
            inputMode === 'upload'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {t('projects.imageUpload.upload') || '上传图片'}
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('url')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
            inputMode === 'url'
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {t('projects.imageUpload.url') || '输入URL'}
        </button>
      </div>

      {inputMode === 'upload' ? (
        /* 上传模式 */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
            ${isDragging
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-white/10 bg-white/5 hover:border-primary-500/50 hover:bg-white/10'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            /* 预览模式 */
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
                  >
                    {t('projects.imageUpload.replace') || '更换图片'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-white text-sm transition-colors"
                  >
                    {t('projects.imageUpload.remove') || '移除'}
                  </button>
                </div>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            /* 上传提示 */
            <div className="flex flex-col items-center justify-center text-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                  <p className="text-slate-300 text-sm">
                    {t('projects.imageUpload.uploading') || '上传中...'}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-slate-300 font-medium mb-1">
                    {t('projects.imageUpload.dragOrClick') || '拖拽图片到此处或点击上传'}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {t('projects.imageUpload.supportedFormats') || '支持 JPG、PNG、GIF 等格式'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {t('projects.imageUpload.maxSize', { size: (maxSize / 1024 / 1024).toFixed(0) }) || `最大 ${(maxSize / 1024 / 1024).toFixed(0)}MB`}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* URL输入模式 */
        <div className="space-y-2">
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={urlInputRef}
              type="url"
              value={preview || ''}
              onChange={handleUrlChange}
              placeholder={t('projects.imageUpload.urlPlaceholder') || '输入图片URL地址'}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            {preview && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
          {preview && (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={() => {
                  showToast(t('projects.imageUpload.invalidUrl') || '无效的图片URL', 'error');
                  setPreview('');
                  onChange?.('');
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-white text-sm transition-colors"
                >
                  {t('imageUpload.remove') || '移除'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

