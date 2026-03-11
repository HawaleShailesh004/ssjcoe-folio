'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  className?: string;
  accept?: string;
  maxSizeInMB?: number;
  helpText?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  className = '',
  accept = 'image/*',
  maxSizeInMB = 2,
  helpText = 'Recommended size: < 2MB',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    setError(null);

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeInMB}MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isPDF = value?.startsWith('data:application/pdf');

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {value ? (
        <div className="relative group">
          {isPDF ? (
            <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <FileText size={48} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">PDF Document Selected</span>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
            <Upload size={24} />
          </div>

          <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mb-2">{helpText}</p>

          {error && (
            <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
