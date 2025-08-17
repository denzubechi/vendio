export type CloudinaryResourceTypes = "image" | "video" | "raw" | "auto";

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video" | "raw";
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}
export const uploadToCloudinary = async (
  file: File,
  resourceType: CloudinaryResourceTypes = "auto"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const uploadMultipleToCloudinary = async (
  files: File[],
  resourceType: CloudinaryResourceTypes = "auto"
): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file, resourceType)
  );
  return Promise.all(uploadPromises);
};
