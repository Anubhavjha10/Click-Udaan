import { jsPDF } from "jspdf";

export function sanitizeFilename(str: string): string {
  if (!str) return "document";
  return str
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "") // Remove filesystem invalid characters
    .replace(/\s+/g, "_") // Replace spaces with underscore
    .replace(/_+/g, "_"); // Remove consecutive underscores
}

/**
 * Loads an image from URL and converts it into a base64 data URL via canvas
 */
function loadImageDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        resolve({
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load certificate image from remote server"));
    };
    img.src = url;
  });
}

/**
 * Downloads high quality Certificate PDF formatted as StudentName_CertificateID.pdf
 */
export async function downloadCertificatePDF(
  imageUrl: string,
  studentName: string,
  certificateId: string
): Promise<void> {
  const sanitizedName = sanitizeFilename(studentName);
  const sanitizedId = sanitizeFilename(certificateId);
  const filename = `${sanitizedName}_${sanitizedId}.pdf`;

  try {
    const { dataUrl, width, height } = await loadImageDataUrl(imageUrl);
    const orientation = width >= height ? "landscape" : "portrait";

    // Set page size matching A4 or aspect ratio
    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: [width, height],
      compress: true,
    });

    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
    pdf.save(filename);
  } catch (err) {
    console.warn("Direct canvas render failed, trying fallback PDF generation:", err);
    // Fallback: standard A4 landscape PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    try {
      pdf.addImage(imageUrl, "JPEG", 10, 10, 277, 190);
      pdf.save(filename);
    } catch (fallbackErr) {
      // Direct file download fallback if image host blocks CORS
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `${filename}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}

/**
 * Downloads the student's Offer Letter with filename StudentName_OfferLetter.pdf
 */
export async function downloadOfferLetterPDF(
  pdfUrl: string,
  studentName: string
): Promise<void> {
  const sanitizedName = sanitizeFilename(studentName);
  const filename = `${sanitizedName}_OfferLetter.pdf`;

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.warn("Blob fetch failed (possibly CORS), opening direct PDF link:", err);
    // Direct open/download fallback
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
