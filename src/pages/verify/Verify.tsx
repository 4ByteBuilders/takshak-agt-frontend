import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { supabase } from "@/supabaseClient";
import axios from "axios";

interface Ticket {
  id: string;
  eventId: string;
  bookingId: string | null;
  status: string;
  type: string;
  quantity: number;
  price: number;
}

interface Booking {
  id: string;
  userId: string;
  tickets: Ticket[];
  amountPaid: number;
  paymentStatus: string;
  paymentSessionId: string | null;
  createdAt: Date;
  numVerifiedAtVenue: number | null;
  qrCode: string;
}

export default function Verify() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState({
    status: false,
    title: "",
    message: "",
  });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [checkedInCount, setCheckedInCount] = useState<number>(0);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Camera permission denied", err);
      setCameraPermission(false);
      setError(
        "Camera access is denied. Please allow camera permissions in browser settings."
      );
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleScan = async (data: string) => {
    console.log(data);
    setQrData(data);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const auth = sessionData.session?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/verify-booking`,
        { qr: data }
      );
      console.log(response.data);
      setShowDialog({
        status: true,
        title: "Success",
        message: response.data.message || "Tickets Verified!",
      });
      setBooking(response.data);
      console.log(booking);
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        setShowDialog({
          status: true,
          title: "Error",
          message: "An error occurred while verifying the booking.",
        });
      } else {
        setShowDialog({
          status: true,
          title: "Error",
          message: "An unknown error occurred while verifying the booking.",
        });
      }
      console.log(error);
    }
  };

  const checkInPeople = async (booking_id: string, checkedInCount: number) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const auth = sessionData.session?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/check-in`,
        { booking_id, checkedInCount }
      );
      setShowDialog({
        status: true,
        title: "Complete",
        message: `Check in successful for ${checkedInCount} people`,
      });
      console.log(response);
    } catch (error) {
      if (error instanceof Error) {
        setShowDialog({
          status: true,
          title: "Error",
          message:
            error.message || "An error occurred while verifying the booking.",
        });
      } else {
        setShowDialog({
          status: true,
          title: "Error",
          message: "An unknown error occurred while verifying the booking.",
        });
      }
    }
  };

  const handleError = (err: unknown) => {
    const errorMessage =
      typeof err === "string"
        ? err
        : "An error occurred while scanning the QR code. Please try again later.";
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

  const incrementCheckedInCount = () => {
    setCheckedInCount((prevCount) => prevCount + 1);
  };

  const decrementCheckedInCount = () => {
    setCheckedInCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };

  return (
    <>
      <style>
        {`
      @keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.animate-scan {
  animation: scan 2s infinite;
}
      `}
      </style>
      <div className="min-h-screen text-white flex flex-col items-center">
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
          <div className="flex items-center justify-center relative w-64 h-64">
            <video ref={ref} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-4 border-green-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500 opacity-50 animate-scan"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}

        {showDialog.status && (
          <div className="mt-8 bg-gray-800 text-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{showDialog.title}</h2>
            {showDialog.title === "Success" && booking ? (
              <>
                <p>{booking.tickets.length} tickets verified!</p>
                {booking.tickets.length === booking.numVerifiedAtVenue ? (
                  <p style={{ color: "orange" }}>
                    All members have already checked in.
                  </p>
                ) : (
                  <>
                    <p>
                      {booking.numVerifiedAtVenue === 0 ? (
                        <p>No Check-Ins Yet</p>
                      ) : (
                        <p>
                          {booking.numVerifiedAtVenue} members Already Checked
                          In
                        </p>
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        className="bg-amber-500 text-white px-4 py-2 rounded-l"
                        onClick={decrementCheckedInCount}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        placeholder="Enter number of people"
                        className="p-2 bg-slate-500 border-t border-b border-gray-300 text-center w-16"
                        value={checkedInCount}
                        onChange={(e) =>
                          setCheckedInCount(Math.max(0, Number(e.target.value)))
                        }
                      />
                      <button
                        className="bg-amber-500 text-white px-4 py-2 rounded-r"
                        onClick={incrementCheckedInCount}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                      onClick={() => checkInPeople(booking.id, checkedInCount)}
                    >
                      Submit
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="mb-4">{showDialog.message}</p>
                <button
                  className="mt-4 bg-amber-500 text-white px-4 py-1 rounded"
                  onClick={() =>
                    setShowDialog({
                      status: false,
                      title: "",
                      message: "",
                    })
                  }
                >
                  Ok
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
