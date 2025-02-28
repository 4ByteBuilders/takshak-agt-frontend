import { useState, useRef, useEffect } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Verify() {
    const [qrData, setQrData] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState({ status: false, title: "", message: "" });
    const [error, setError] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [ticketInfo, setTicketInfo] = useState<any>(null);
    const [checkedInCount, setCheckedInCount] = useState<number>(1);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleScan = async (data: string) => {
        setQrData(data);
        setCameraActive(false);
        await handleVerify(data);
    };

    const handleVerify = async (qr: string) => {
        try {
            const { data } = await supabase.auth.getSession();
            const auth = data.session?.access_token;
            axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/booking/verify-booking`, { qr });

            if (!response.data.status) {
                setShowDialog({
                    status: true,
                    title: "Invalid Ticket",
                    message: "This ticket is not valid.",
                });
                setTicketInfo(null);
            } else {
                setTicketInfo(response.data);
                setCheckedInCount(response.data.checkedInCount || 1);
            }
        } catch (err) {
            console.error(err);
            setShowDialog({
                status: true,
                title: "Error",
                message: "An error occurred while verifying the QR code. Please try again later.",
            });
        }
    };

    const handleCheckIn = async () => {
        if (!ticketInfo) return;

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/booking/checkin`, {
                bookingId: ticketInfo.bookingId,
                checkedInCount
            });

            setShowDialog({
                status: true,
                title: "Check-In Successful",
                message: `Checked in ${checkedInCount} out of ${ticketInfo.totalCount} persons.`,
            });

            setTicketInfo({ ...ticketInfo, checkedInCount });
        } catch (err) {
            console.error(err);
            setShowDialog({
                status: true,
                title: "Error",
                message: "An error occurred during check-in. Please try again.",
            });
        }
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

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setShowDialog({
                status: true,
                title: "Camera Access Denied",
                message: "Please allow camera access in your browser settings.",
            });
        }
    };

    const stopCamera = () => {
        setCameraActive(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(err => console.error("Video play error:", err));
        }
    }, [cameraActive]);

    return (
        <div className="min-h-screen text-white flex flex-col items-center py-10 px-6">
            <h1 className="text-4xl font-bold mb-6">Verify QR Code</h1>

            <div className="flex gap-4 mb-6">
                {!cameraActive ? (
                    <Button onClick={startCamera} className="bg-green-500 hover:bg-green-600">
                        Start Camera
                    </Button>
                ) : (
                    <Button variant={'destructive'} onClick={stopCamera}>
                        Stop Camera
                    </Button>
                )}
            </div>

            {cameraActive && (
                <video
                    ref={(el) => { ref.current = el; videoRef.current = el; }}
                    className="w-full max-w-md border border-gray-300 rounded-lg"
                    autoPlay
                    playsInline
                    muted
                />
            )}

            {qrData && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
                    <p className="text-lg font-semibold text-gray-300">QR Code Data: {qrData}</p>
                </div>
            )}

            {ticketInfo && ticketInfo.status && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-semibold text-green-400">Valid Ticket</h2>
                    <p className="text-gray-300">Booking ID: {ticketInfo.bookingId}</p>
                    <p className="text-gray-300">Name: {ticketInfo.user.name}</p>
                    <p className="text-gray-300">Email: {ticketInfo.user.email}</p>
                    <p className="text-gray-300">Phone: {ticketInfo.user.phone}</p>
                    <p className="text-gray-300">
                        Checked In: {ticketInfo.checkedInCount} / {ticketInfo.totalCount}
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                        <label className="text-gray-300 text-sm">Enter persons to check-in:</label>
                        <Input
                            type="number"
                            value={checkedInCount}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > ticketInfo.totalCount) return;
                                setCheckedInCount(value);
                            }}
                            min={1}
                            max={ticketInfo.totalCount}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />

                        <Button
                            onClick={handleCheckIn}
                            className="bg-blue-500 w-full mt-2"
                        >
                            Check In
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-2 text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            <AlertDialog open={showDialog.status} onOpenChange={(open) => setShowDialog(prev => ({ ...prev, status: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{showDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>{showDialog.message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog({ status: false, title: "", message: "" })}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
