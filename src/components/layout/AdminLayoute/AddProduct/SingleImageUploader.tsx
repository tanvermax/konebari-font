// SingleImageUploader.tsx - Simple Version (No infinite loop)
import { useState, useCallback, useRef } from "react";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";

interface SingleImageUploaderProps {
  onChange: (file: File | null) => void;
}

export default function SingleImageUploader({ onChange }: SingleImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);

  const handleFile = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null);
      setError(null);
      onChange(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      onChange(null);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      onChange(null);
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    onChange(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = false;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = true;
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = false;
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const removeImage = useCallback(() => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-input hover:bg-accent/50 relative flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-4 transition-colors cursor-pointer ${
            isDragging.current ? 'border-pink-500 bg-pink-50/50' : 'border-pink-200/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
          />
          
          {preview ? (
            <div className="absolute inset-0">
              <img
                src={preview}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-pink-200">
                <ImageUpIcon className="size-4 opacity-60 text-pink-500" />
              </div>
              <p className="mb-1.5 text-sm font-medium text-zinc-700">
                Drop your image here or click to browse
              </p>
              <p className="text-muted-foreground text-xs">
                Max size: 5MB
              </p>
            </div>
          )}
        </div>
        
        {preview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            className="absolute top-3 right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 flex items-center gap-1 text-xs">
          <AlertCircleIcon className="size-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}