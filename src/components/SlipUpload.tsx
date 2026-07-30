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

export default function SlipUpload({ orderId, userId, orderStatus, slipUrl, onUploadSuccess }: SlipUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Size check: max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please upload a smaller receipt.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Format check: images or PDF
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg("Invalid format. Only JPEG, PNG, WEBP, or PDF files are allowed.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
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
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        onUploadSuccess();
      }, 1500);

    } catch (err: any) {
      console.error("Upload error details:", err);
      setErrorMsg(err.message || "Failed to upload slip. Please try again.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (orderStatus === 'pending_verification') {
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
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 border border-white/5 bg-slate-900/5 text-left" hoverEffect={false}>
      <h3 className="text-lg font-bold text-white mb-2">Upload Payment Receipt</h3>
      <p className="text-slate-400 text-xs mb-6">
        Please upload your bank receipt or payment slip (PNG, JPG, or PDF up to 5MB) to initiate verification.
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
          ✔ {successMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            id="slip-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Select Document
          </button>
          <span className="text-xs text-slate-400 truncate max-w-[200px]">
            {file ? file.name : "No file selected"}
          </span>
        </div>

        {uploading && (
          <div className="space-y-2">
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
          className="w-full py-2.5 mt-2"
        >
          {uploading ? "Uploading Slip..." : "Upload Receipt"}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}
