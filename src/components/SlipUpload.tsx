import { useState, useRef, useEffect } from 'react';
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

export default function SlipUpload({ orderId, userId, orderStatus, slipUrl, onUploadSuccess }: SlipUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      clearSelectedFile();
      return;
    }

    // Size check: max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please upload a smaller receipt.");
      clearSelectedFile();
      return;
    }

    // Format check: images or PDF
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg("Invalid format. Only JPEG, PNG, WEBP, or PDF files are allowed.");
      clearSelectedFile();
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }

    if (selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }

    setFile(selectedFile);
  };

  const clearSelectedFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    setProgress(15);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      setProgress(40);

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        throw uploadError;
      }
      setProgress(75);

      // 2. Resolve URL path and update Orders table
      const slipUrlPath = uploadData.path;
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          slip_url: slipUrlPath,
          status: 'pending_verification'
        })
        .eq('id', orderId);

      if (updateError) {
        console.error("Supabase Orders Table Update Error:", updateError);
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
      setErrorMsg(err.message || "Failed to upload slip. Please try again.");
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

  // If already submitted and user is not currently trying to replace/re-upload it
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
            Please upload your bank receipt or payment slip (PNG, JPG, WEBP, or PDF up to 5MB) to initiate verification.
          </p>
        </div>
        {isReplacing && (
          <button
            type="button"
            onClick={() => {
              clearSelectedFile();
              setIsReplacing(false);
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
          ✔ {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* Hidden File Input with dynamic ID */}
        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          disabled={uploading}
        />

        {/* File Select Trigger or Selected File Preview */}
        {!file ? (
          <label
            htmlFor={inputId}
            className="w-full border-2 border-dashed border-slate-800 hover:border-primary/50 bg-slate-950/40 hover:bg-slate-900/40 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center touch-manipulation min-h-[100px]"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📄</span>
            <span className="text-xs font-bold text-slate-200 group-hover:text-primary transition-colors">
              Tap / Click to Select Receipt
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Supports JPEG, PNG, WEBP, PDF (Max 5MB)
            </span>
          </label>
        ) : (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0 bg-slate-900"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                  📑
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-[280px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Size: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
              <label
                htmlFor={inputId}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Change
              </label>
              <button
                type="button"
                onClick={clearSelectedFile}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
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
          disabled={!file || uploading}
          className="w-full py-2.5 mt-2 cursor-pointer"
        >
          {uploading ? "Uploading Slip..." : isReplacing ? "Confirm & Replace Receipt" : "Upload Receipt"}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}

