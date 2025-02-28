import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
// import axios from "axios";
// import { supabase } from "@/supabaseClient";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
    AlertDialogAction
} from "@/components/ui/alert-dialog";

export default function Verify() {
    const [qrData, setQrData] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState({ status: false, title: "", message: "" });
    const [error, setError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

    // Function to manually request camera permission
    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission(true);
            stream.getTracks().forEach(track => track.stop()); // Close camera after granting permission
        } catch (err) {
            console.error("Camera permission denied", err);
            setCameraPermission(false);
            setError("Camera access is denied. Please allow camera permissions in browser settings.");
        }
    };

    useEffect(() => {
        requestCameraPermission(); // Request permission when component mounts
    }, []);

    const handleScan = async (data: string) => {
        setQrData(data);
        // try {
        //     const { data: sessionData } = await supabase.auth.getSession();
        //     const auth = sessionData.session?.access_token;
        //     axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        //     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify`, { qrData: data });
        //     setShowDialog({
        //         status: true,
        //         title: "Success",
        //         message: response.data.message,
        //     });
        // } catch (error) {
        //     setShowDialog({
        //         status: true,
        //         title: "Error",
        //         message: "An error occurred while verifying the QR code. Please try again later.",
        //     });
        //     console.log(error);
        // }
    };

    const handleError = (err: unknown) => {
        const errorMessage = typeof err === "string" ? err : "An error occurred while scanning the QR code. Please try again later.";
        setError(errorMessage);
        setShowDialog({
            status: true,
            title: "Error",
            message: errorMessage,
        });
    };

    const { ref } = useZxing({
        onDecodeResult(result) {
            handleScan(result.getText());
        },
        onError(error: unknown) {
            handleError(error);
        },
    });

    return (
        <div className="min-h-screen text-white flex flex-col items-center py-10 px-6">
            <h1 className="text-4xl font-bold mb-6">Verify QR Code</h1>

            {cameraPermission === false ? (
                <div className="text-red-500">
                    <p>Camera permission is required to scan QR codes.</p>
                    <button
                        onClick={requestCameraPermission}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Retry Permission
                    </button>
                </div>
            ) : (
                <video ref={ref} style={{ width: '100%' }} />
            )}

            {qrData && (
                <div className="mt-4">
                    <p>QR Code Data: {qrData}</p>
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            <AlertDialog open={showDialog.status} onOpenChange={(open) => setShowDialog(prev => ({ ...prev, status: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{showDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {showDialog.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog({
                            status: false,
                            title: "",
                            message: "",
                        })}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
