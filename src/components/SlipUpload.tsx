import { useEffect, useRef, useState } from 'react';
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

const MAX_SLIP_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

// MIME metadata from Android gallery providers can be empty, so verify the
// actual file signature instead of relying only on the file name or MIME type.
const detectSupportedImageType = async (selectedFile: File): Promise<string | null> => {
  const bytes = new Uint8Array(await selectedFile.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isWebp =
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

  if (isJpeg) return 'image/jpeg';
  if (isPng) return 'image/png';
  if (isWebp) return 'image/webp';
  return null;
};

export default function SlipUpload({ orderId, userId, orderStatus, slipUrl, onUploadSuccess }: SlipUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [detectedContentType, setDetectedContentType] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  useEffect(() => () => {
    if (filePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
  }, [filePreview]);

  const clearSelectedFile = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setDetectedContentType(null);
    setFilePreview(null);
    setPreviewFailed(false);
    setProcessingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);
    setPreviewFailed(false);

    const input = e.currentTarget;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    const selectedFile = files[0];
    const fileType = (selectedFile.type || '').toLowerCase();
    input.value = '';

    if (selectedFile.size > MAX_SLIP_SIZE) {
      setErrorMsg("Image size is too large. Please select an image smaller than 2 MB.");
      setFile(null);
      setDetectedContentType(null);
      setFilePreview(null);
      return;
    }

    setProcessingFile(true);
    try {
      const hasAllowedMime = !fileType || fileType === 'application/octet-stream' || ALLOWED_IMAGE_TYPES.has(fileType);
      const imageContentType = await detectSupportedImageType(selectedFile);
      if (!hasAllowedMime || !imageContentType) {
        setErrorMsg("Invalid file. Please select a JPG, PNG, or WEBP image only.");
        setFile(null);
        setDetectedContentType(null);
        setFilePreview(null);
        return;
      }

      setFile(selectedFile);
      setDetectedContentType(imageContentType);
      setFilePreview(URL.createObjectURL(selectedFile));
    } catch {
      setErrorMsg("We could not read that image. Please select another JPG, PNG, or WEBP image.");
      setFile(null);
      setDetectedContentType(null);
      setFilePreview(null);
    } finally {
      setProcessingFile(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (file.size > MAX_SLIP_SIZE || !detectedContentType) {
      setErrorMsg("Please select a valid JPG, PNG, or WEBP image smaller than 2 MB.");
      return;
    }
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

      const fileExt = detectedContentType === 'image/png' ? 'png' : detectedContentType === 'image/webp' ? 'webp' : 'jpg';
      const safeOrderId = orderId.replace(/[^a-zA-Z0-9-]/g, '');
      const safeUserId = currentUserId.replace(/[^a-zA-Z0-9-]/g, '');
      const fileName = `${safeOrderId}-${Date.now()}.${fileExt}`;
      const filePath = `${safeUserId}/${fileName}`;

      setProgress(40);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: detectedContentType,
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(75);

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

  if (orderStatus === 'pending_verification' && !isReplacing) {
    const fileName = slipUrl ? slipUrl.split('/').pop() : "receipt-document";
    return (
      <GlassCard className="p-6 border border-slate-300 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/5 text-left" hoverEffect={false}>
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
          <span className="text-xl">✅</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Slip submitted — awaiting verification</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
          Document: <span className="font-mono text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-950/60 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700/80">{fileName}</span>
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded wrong image?</p>
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setIsReplacing(true);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄</span> Replace / Re-upload Receipt
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 border border-slate-300 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/5 text-left space-y-4" hoverEffect={false}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {isReplacing ? "Replace Payment Receipt" : "Upload Payment Receipt"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Please upload your bank receipt or payment slip as a JPG, PNG, or WEBP image (maximum 2 MB).
          </p>
        </div>
        {isReplacing && (
          <button
            type="button"
            onClick={() => {
              clearSelectedFile();
              setIsReplacing(false);
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-500 font-semibold leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed">
          ✔ {successMsg}
        </div>
      )}

      <div className="space-y-4">
        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="sr-only"
          disabled={uploading || processingFile}
        />
        {!file ? (
          <>
            <label
              htmlFor={inputId}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-primary/50 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[110px] cursor-pointer group transition-all select-none relative"
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform pointer-events-none">📄</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors pointer-events-none">
                Tap / Click to Select Receipt
              </span>
              <span className="text-[10px] text-slate-500 mt-1 pointer-events-none">
                JPG, PNG, or WEBP image · Maximum 2 MB
              </span>
            </label>
          </>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {filePreview && !previewFailed ? (
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  onError={() => setPreviewFailed(true)}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl shrink-0">
                  📑
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-[280px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Size: {formatFileSize(file.size)} {processingFile && <span className="text-amber-600 dark:text-amber-400 font-sans ml-1">(Optimizing...)</span>}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Ready for submission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-3 sm:pt-0">
              <label
                htmlFor={inputId}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors text-center inline-block select-none"
              >
                Change
              </label>
              <button
                type="button"
                onClick={clearSelectedFile}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer z-20 relative"
              >
                <span>🗑️</span> Remove
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2 pt-2">
            <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden">
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
