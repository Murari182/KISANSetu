"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Camera, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { GlassButton } from "./GlassButton";

export interface GlassUploadProps {
  onFileSelect: (file: File, base64Preview: string) => void;
  onClear?: () => void;
  accept?: string;
  maxSizeBytes?: number; // default 10MB
  title?: string;
  hint?: string;
  previewUrl?: string;
  allowCamera?: boolean;
}

export const GlassUpload: React.FC<GlassUploadProps> = ({
  onFileSelect,
  onClear,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  title = "Upload image or drag & drop",
  hint = "Supports JPG, PNG up to 10MB",
  previewUrl: initialPreview,
  allowCamera = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setError("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onFileSelect(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearFile = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onClear?.();
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Hidden standard file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {/* Hidden camera input for mobile capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {preview ? (
        <div className="relative rounded-3xl overflow-hidden border border-white/80 dark:border-white/10 bg-black/5 dark:bg-white/5 aspect-video sm:aspect-[21/9] flex items-center justify-center group shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </GlassButton>
            <GlassButton variant="danger" size="sm" onClick={clearFile}>
              <X className="w-4 h-4 mr-1" /> Remove
            </GlassButton>
          </div>
          {fileName && (
            <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs truncate">
              {fileName}
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
              : "border-black/15 dark:border-white/15 bg-white/40 dark:bg-[#0c1410]/40 hover:bg-white/70 dark:hover:bg-[#0c1410]/70"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3.5 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-foreground/50 mt-1 max-w-xs">{hint}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <GlassButton
              variant="secondary"
              size="sm"
              iconLeft={<ImageIcon className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </GlassButton>
            {allowCamera && (
              <GlassButton
                variant="outline"
                size="sm"
                iconLeft={<Camera className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
              >
                Use Camera
              </GlassButton>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-500 font-medium mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
