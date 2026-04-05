import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ImageUploader = ({ images = [], onChange, maxFiles = 5, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFiles = useCallback((files) => {
    const errors = [];
    const validFiles = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only JPEG, PNG, and WebP allowed`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File exceeds 5MB limit`);
      } else {
        validFiles.push(file);
      }
    });

    if (images.length + validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} images allowed`);
      return { validFiles: validFiles.slice(0, maxFiles - images.length), errors };
    }

    return { validFiles, errors };
  }, [images, maxFiles]);

  const handleFiles = useCallback(async (fileList) => {
    setError('');
    const { validFiles, errors } = validateFiles(fileList);

    if (errors.length > 0) {
      setError(errors.join('. '));
    }

    if (validFiles.length === 0) return;

    // Create preview objects
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    onChange([...images, ...newImages]);
  }, [images, onChange, validateFiles]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((idx) => {
    const removedImg = images[idx];
    if (removedImg.preview) {
      URL.revokeObjectURL(removedImg.preview);
    }
    onChange(images.filter((_, i) => i !== idx));
  }, [images, onChange]);

  const canAddMore = images.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-3 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-300
            ${dragActive
              ? 'border-primary-500 bg-primary-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
            ${dragActive ? 'bg-primary-100 text-primary-600 scale-110' : 'bg-slate-100 text-slate-400'}`}>
            <Upload size={28} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {dragActive ? 'Drop images here' : 'Upload Photos'}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Drag & drop or click to browse • JPEG, PNG, WebP up to 5MB
          </p>
          <p className="text-primary-600 text-xs font-bold mt-2">
            {images.length}/{maxFiles} images
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50"
            >
              <img
                src={img.preview || img.url || img}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="p-2 bg-white/90 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Index badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-lg">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
