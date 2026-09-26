export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  original_filename?: string;
}

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "qfyp5jiy";
export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "certificate";

export const MAX_OFFER_LETTER_BYTES = 1024 * 1024; // 1 MB strictly

export const validateOfferLetter = (
  file: File
): { valid: boolean; error?: string } => {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Only PDF files are allowed for Offer Letters." };
  }
  if (file.size > MAX_OFFER_LETTER_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Offer Letter must be smaller than 1 MB. Selected file is ${sizeInMB} MB.`,
    };
  }
  return { valid: true };
};

export const validateCertificateImage = (
  file: File
): { valid: boolean; error?: string } => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Only JPG, JPEG, PNG, or WebP images are allowed for Certificates.",
    };
  }
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Upload a file directly to Cloudinary using an unsigned upload preset with progress reporting.
 */
export const uploadToCloudinary = (
  file: File,
  folder?: string,
  onProgress?: (progressPercent: number) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    if (folder) {
      formData.append("folder", folder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secure_url: response.secure_url,
            public_id: response.public_id,
            format: response.format,
            bytes: response.bytes,
            original_filename: response.original_filename,
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errResp = JSON.parse(xhr.responseText);
          reject(new Error(errResp?.error?.message || `Cloudinary upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload"));
    };

    xhr.send(formData);
  });
};
