import { useState } from "react";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import QrScanner from "./QrScanner";
import Dialog from "./Dialog";
import Loader from "./Loader";
import { Booking } from "@/utils/interfaces";
import BookingDetails from "./BookingDetails";

export default function Verify() {
  const [showDialog, setShowDialog] = useState({
    status: false,
    title: "",
    message: "",
  });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const handleScan = async (data: string) => {
    setLoading(true);
    setIsScanning(false);
    try {
      navigator.vibrate(200);
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
    } catch (err) {
      console.error(err);
      setShowDialog({
        status: true,
        title: "Error",
        message: "An error occurred while verifying the booking.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center pt-16">
      <h1 className="text-4xl font-bold mb-6">Verify QR Code</h1>

      {/* Default Message */}
      {!isScanning && !loading && (
        <div className="mt-4 text-center rounded-lg p-6 md:w-1/2 lg:w-1/3">
          <p className="mb-4">Click on the button below to start scanning.</p>
        </div>
      )}

      {/* Scanner Toggle Button */}
      <button
        className={`px-4 py-2 rounded ${isScanning ? "bg-red-500" : "bg-green-500"} text-white`}
        onClick={() => setIsScanning(!isScanning)}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </button>

      {/* QR Scanner */}
      {isScanning ? <QrScanner isScanning={isScanning} onScan={handleScan} /> : null}

      {/* Loader */}
      {loading && <Loader />}

      {/* Dialog */}
      {showDialog.status && (
        <Dialog
          title={showDialog.title}
          message={showDialog.message}
          onClose={() => setShowDialog({ status: false, title: "", message: "" })}
        />
      )}

      {/* Booking Details */}
      {booking && <BookingDetails booking={booking} />}
    </div>
  );
}
