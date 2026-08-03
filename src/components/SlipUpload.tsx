import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import GlassCard from './GlassCard';
import AnimatedButton from './AnimatedButton';

interface SlipUploadProps {
  orderId: string;
  userId: string;
  orderStatus: string;
  slipUrl: string | null;
  onUploadSuccess: () => void;
}

// Client-side image compression helper for mobile phone camera photos (routinely 8MB-15MB)
const compressMobileImageIfNeeded = async (originalFile: File): Promise<File> => {
  const fileName = (originalFile.name || '').toLowerCase();
  const fileType = (originalFile.type || '').toLowerCase();

  const isPdf = fileType.includes('pdf') || fileName.endsWith('.pdf');
  const isHeic = fileType.includes('heic') || fileType.includes('heif') || /\.(heic|heif)$/i.test(fileName);

  // HEIC and PDF files cannot be decoded natively by HTML Image() canvas - return raw file directly
  if (isPdf || isHeic) {
    return originalFile;
  }

  const isImage = fileType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|jfif)$/i.test(fileName);

  if (!isImage) return originalFile;
  if (originalFile.size <= 1.5 * 1024 * 1024) return originalFile; // Under 1.5MB doesn't need compression

  return new Promise((resolve) => {
    // 2.5s Timeout guard so slow mobile devices never get stuck
    const timer = setTimeout(() => {
      resolve(originalFile);
    }, 2500);

    const safeResolve = (result: File) => {
      clearTimeout(timer);
      resolve(result);
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      const srcStr = e.target?.result as string;
      if (!srcStr) {
        safeResolve(originalFile);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1920;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            safeResolve(originalFile);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                safeResolve(originalFile);
                return;
              }
              const cleanName = originalFile.name.replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], cleanName, {
                type: "image/jpeg",
                lastModified: Date.now()
              });
              safeResolve(compressedFile);
            },
            'image/jpeg',
            0.85
          );
        } catch {
          safeResolve(originalFile);
        }
      };
      img.onerror = () => safeResolve(originalFile);
      img.src = srcStr;
    };
    reader.onerror = () => safeResolve(originalFile);
    reader.readAsDataURL(originalFile);
  });
};

export default function SlipUpload({ orderId, userId, orderStatus, slipUrl, onUploadSuccess }: SlipUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  const clearSelectedFile = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setPreviewFailed(false);
    setProcessingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);
    setPreviewFailed(false);

    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const selectedFile = files[0];
    const fileType = (selectedFile.type || '').toLowerCase();
    const fileName = (selectedFile.name || '').toLowerCase();

    const isPdf = fileType.includes('pdf') || fileName.endsWith('.pdf');
    const isHeic = fileType.includes('heic') || fileType.includes('heif') || /\.(heic|heif)$/i.test(fileName);
    const isStandardWebImage = !isPdf && !isHeic && (fileType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|svg|jfif)$/i.test(fileName));

    // Reject only explicitly non-document extensions (executables, archives, videos)
    const isDisallowed = /\.(exe|apk|app|zip|rar|tar|mp4|avi|mov|mp3|wav)$/i.test(fileName);
    if (isDisallowed) {
      const err = "Invalid format. Please select an image or PDF receipt.";
      setErrorMsg(err);
      clearSelectedFile();
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      const err = "File size is too large (max 25MB). Please select a smaller file.";
      setErrorMsg(err);
      clearSelectedFile();
      return;
    }

    // Revoke previous blob URL if exists
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }

    // 1. INSTANTLY set selected file
    setFile(selectedFile);

    if (isStandardWebImage) {
      try {
        const objectUrl = URL.createObjectURL(selectedFile);
        setFilePreview(objectUrl);
      } catch {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }

    // 2. Background compression for larger standard images (> 1.5MB)
    if (isStandardWebImage && selectedFile.size > 1.5 * 1024 * 1024) {
      setProcessingFile(true);
      compressMobileImageIfNeeded(selectedFile)
        .then((compressedFile) => {
          setFile(compressedFile);
        })
        .catch(() => {})
        .finally(() => {
          setProcessingFile(false);
        });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    setProgress(15);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn("Auth User warning:", authError.message);
      }
      const currentUserId = authData?.user?.id || userId;

      if (!currentUserId) {
        throw new Error("Authentication session missing. Please log in again.");
      }

      const rawExt = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
      const fileExt = rawExt ? rawExt.toLowerCase() : 'jpg';
      const fileName = `${orderId}-${Date.now()}.${fileExt}`;
      const filePath = `${currentUserId}/${fileName}`;

      setProgress(40);

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(75);

      // 2. Update Orders table
      const slipUrlPath = uploadData.path;
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          slip_url: slipUrlPath,
          status: 'pending_verification'
        })
        .eq('id', orderId);

      if (updateError) {
        throw updateError;
      }

      setProgress(100);
      setSuccessMsg("Payment slip uploaded successfully!");
      clearSelectedFile();
      setIsReplacing(false);

      setTimeout(() => {
        onUploadSuccess();
      }, 1200);

    } catch (err: any) {
      console.error("Upload error details:", err);
      const fullMessage = err?.message || JSON.stringify(err) || "Unknown upload error";
      setErrorMsg(fullMessage);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const inputId = `slip-input-${orderId}`;

  // If already submitted and user is not replacing
  if (orderStatus === 'pending_verification' && !isReplacing) {
    const fileName = slipUrl ? slipUrl.split('/').pop() : "receipt-document";
    return (
      <GlassCard className="p-6 border border-white/5 bg-slate-900/5 text-left" hoverEffect={false}>
        <div className="flex items-center gap-3 text-emerald-400 font-semibold mb-2">
          <span className="text-xl">✅</span>
          <h3 className="text-lg font-bold text-white">Slip submitted — awaiting verification</h3>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          Document: <span className="font-mono text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-white/5">{fileName}</span>
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">Uploaded wrong image?</p>
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setIsReplacing(true);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄</span> Replace / Re-upload Receipt
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 border border-white/5 bg-slate-900/5 text-left space-y-4" hoverEffect={false}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isReplacing ? "Replace Payment Receipt" : "Upload Payment Receipt"}
          </h3>
          <p className="text-slate-400 text-xs">
            Please upload your bank receipt or payment slip (PNG, JPG, WEBP, or PDF) to initiate verification.
          </p>
        </div>
        {isReplacing && (
          <button
            type="button"
            onClick={() => {
              clearSelectedFile();
              setIsReplacing(false);
            }}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/60"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold leading-relaxed">
          ✔ {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {!file ? (
          <>
            <input
              id={inputId}
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              accept="image/*,application/pdf,.heic,.heif,.pdf,.jpg,.jpeg,.png,.webp"
              className="sr-only"
              disabled={uploading}
            />
            <label
              htmlFor={inputId}
              className="w-full border-2 border-dashed border-slate-800 hover:border-primary/50 bg-slate-950/40 hover:bg-slate-900/40 rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[110px] cursor-pointer group transition-all select-none relative"
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform pointer-events-none">📄</span>
              <span className="text-xs font-bold text-slate-200 group-hover:text-primary transition-colors pointer-events-none">
                Tap / Click to Select Receipt
              </span>
              <span className="text-[10px] text-slate-500 mt-1 pointer-events-none">
                Supports JPEG, PNG, WEBP, HEIC, PDF
              </span>
            </label>
          </>
        ) : (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {filePreview && !previewFailed ? (
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  onError={() => setPreviewFailed(true)}
                  className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0 bg-slate-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-3xl shrink-0">
                  📑
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[280px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Size: {formatFileSize(file.size)} {processingFile && <span className="text-amber-400 font-sans ml-1">(Optimizing...)</span>}
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                  ✓ Ready for submission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
              <input
                id={`change-${inputId}`}
                type="file"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()}
                accept="image/*,application/pdf,.heic,.heif,.pdf,.jpg,.jpeg,.png,.webp"
                className="sr-only"
                disabled={uploading}
              />
              <label
                htmlFor={`change-${inputId}`}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors text-center inline-block select-none"
              >
                Change
              </label>
              <button
                type="button"
                onClick={clearSelectedFile}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer z-20 relative"
              >
                <span>🗑️</span> Remove
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2 pt-2">
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 text-right font-mono">{progress}% uploaded</div>
          </div>
        )}

        <AnimatedButton
          onClick={handleUpload}
          variant="primary"
          disabled={!file || uploading || processingFile}
          className="w-full py-2.5 mt-2 cursor-pointer"
        >
          {uploading ? "Uploading Slip..." : isReplacing ? "Confirm & Replace Receipt" : "Upload Receipt"}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}



