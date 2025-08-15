"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, File } from "lucide-react";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "@/lib/cloudinary";
import { toast } from "sonner";

interface FileUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  className?: string;
  accept?: string;
}

export function FileUpload({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  label = "Files",
  className = "",
  accept = "*/*", // Default to all file types
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      toast.error("Please select only one file");
      return;
    }

    if (multiple && value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    try {
      let newUrls: string[];

      if (multiple) {
        newUrls = await uploadMultipleToCloudinary(files);
        onChange([...value, ...newUrls]);
      } else {
        const url = await uploadToCloudinary(files[0]);
        onChange([url]);
      }

      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload file(s)");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || (!multiple && value.length >= 1)}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {value.length === 0 ? `Upload ${label}` : `Add More ${label}`}
              </>
            )}
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                =
                {url &&
                (url.endsWith(".jpg") ||
                  url.endsWith(".png") ||
                  url.endsWith(".jpeg") ||
                  url.endsWith(".gif") ||
                  url.endsWith(".svg")) ? (
                  <img
                    src={url}
                    alt={`Uploaded file ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {multiple && (
        <p className="text-sm text-muted-foreground">
          {value.length}/{maxFiles} files uploaded
        </p>
      )}
    </div>
  );
}
