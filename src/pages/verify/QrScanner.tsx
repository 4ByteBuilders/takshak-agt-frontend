import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
    isScanning: boolean;
    onScan: (data: string) => void;
    onError?: (error: string) => void;
}

export default function QrScanner({ isScanning, onScan, onError }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const cameraId = "qr-reader";

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
                () => { } // Ignore errors
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

    return <div id={cameraId} className="w-64 h-64 mt-4"></div>;
}
