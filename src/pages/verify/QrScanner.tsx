import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  isScanning: boolean;
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QrScanner({
  isScanning,
  onScan,
  onError,
}: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraId = "qr-reader";
  //   const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning]);

  const startScanner = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(cameraId);
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => onScan(decodedText),
        () => {} // Ignore errors
      );
    } catch {
      onError?.("Failed to access the camera. Please check permissions.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
  };

  return (
    <div className="relative w-72 h-72 overflow-hidden rounded-lg bg-black">
      {/* Scanner container where video will be rendered */}
      <div id={cameraId} className="w-full h-full" />

      {/* Scanner overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanning border frame */}
        <div className="absolute inset-0 border-4 border-green-400 rounded-lg" />

        {/* Scanning line animation */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-full h-1 bg-gradient-to-b from-green-400 via-emerald-300 to-transparent animate-scan" />
        </div>
      </div>

      <style>{`
    @keyframes scan {
      0% { top: -4px; }
      100% { top: calc(100% - 4px); }
    }
    .animate-scan {
      animation: scan 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      top: -4px;
    }
  `}</style>
    </div>
  );
}
