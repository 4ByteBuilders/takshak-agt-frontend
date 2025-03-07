import { useState } from "react";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import QrScanner from "./QrScanner";
import Dialog from "./Dialog";
import Loader from "./Loader";
import { Booking } from "@/utils/interfaces";
import BookingDetails from "./BookingDetails";
import { motion, AnimatePresence } from "framer-motion";

export default function Verify() {
  const [showDialog, setShowDialog] = useState({
    status: false,
    title: "",
    message: "",
  });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleCheckInSuccess = (numCheckedIn: number) => {
    if (booking) {
      setBooking({
        ...booking,
        numVerifiedAtVenue: booking.numVerifiedAtVenue! + numCheckedIn,
      });
    }
  };

  const handleScan = async (data: string) => {
    setBooking(null);
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
      // Set booking data but do not show success dialog
      setBooking(response.data);
    } catch (err) {
      console.error(err);
      // Show error dialog only when an error occurs
      setShowDialog({
        status: true,
        title: "Error",
        message: axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "An error occurred.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center pt-16 bg-gray-900">
      <h1 className="text-4xl font-bold mb-6">Verify QR Code</h1>

      {/* Default Message */}
      <AnimatePresence>
        {!isScanning && !loading && !booking && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 text-center rounded-lg p-6 md:w-1/2 lg:w-1/3"
          >
            <p className="mb-4">Click on the button below to start scanning.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-full ${isScanning ? "bg-red-500" : "bg-green-500"
          } text-white font-semibold shadow-lg`}
        onClick={() => setIsScanning(!isScanning)}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </motion.button>

      {/* QR Scanner */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 w-full max-w-md"
          >
            <QrScanner isScanning={isScanning} onScan={handleScan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 w-full max-w-md"
          >
            <BookingDetails booking={booking} onCheckInSuccess={handleCheckInSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <AnimatePresence>
        {showDialog.status && showDialog.title === "Error" && (
          <Dialog
            title={showDialog.title}
            message={showDialog.message}
            onClose={() =>
              setShowDialog({ status: false, title: "", message: "" })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}