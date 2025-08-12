/**
 * Image Upload Component - Created on 12/08/2025 16:52
 * Handles drag-and-drop image upload with preview
 */

"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onRemoveImage: () => void;
  previewUrl: string | null;
  error?: string;
}

export function ImageUpload({ onFileSelect, onRemoveImage, previewUrl, error }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <FormItem>
      <FormLabel>Upload Photo</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {!previewUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop your photo here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG, or WebP up to 5MB
                </p>
              </div>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleInputChange}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Camera className="mr-2 h-4 w-4" />
                Choose Photo
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={onRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
