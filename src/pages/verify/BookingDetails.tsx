import { useState } from "react";
import { Booking } from "@/utils/interfaces";
import axios from "axios";
import { supabase } from "@/supabaseClient";

interface BookingDetailsProps {
  booking: Booking;
  onCheckInSuccess: (numCheckedIn: number) => void; // Callback to update parent state
}

export default function BookingDetails({
  booking,
  onCheckInSuccess,
}: BookingDetailsProps) {
  const { user, totalPeople, numVerifiedAtVenue, id } = booking;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const peopleLeft = totalPeople - numVerifiedAtVenue!;

  const handleCheckIn = async () => {
    if (selectedNum === null || selectedNum > peopleLeft) {
      setError("Invalid selection.");
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const auth = sessionData.session?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify/check-in`, {
        bookingId: id,
        numToCheckIn: selectedNum,
      });

      // Update local state instead of reloading the page
      onCheckInSuccess(selectedNum); // Notify parent component to update state
    } catch {
      setError("An error occurred while checking in.");
    } finally {
      setLoading(false);
      setShowConfirmation(false); // Close confirmation dialog
      setSelectedNum(null); // Reset selection
    }
  };

  return (
    <div className="mt-6 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>
      <p>
        <span className="font-semibold">Total People Allowed:</span>{" "}
        {totalPeople}
      </p>
      <p>
        <span className="font-semibold">Checked in at Venue:</span>{" "}
        {numVerifiedAtVenue}
      </p>
      <p>
        <span className="font-semibold">People Left to Check In:</span>{" "}
        {peopleLeft}
      </p>

      {/* No People Left Message */}
      {peopleLeft === 0 && (
        <p className="mt-4 text-green-500">All people have been checked in.</p>
      )}

      {/* Check-in Buttons */}
      {peopleLeft > 0 && (
        <div className="mt-4">
          <p className="font-semibold mb-2">
            Select number of people to check in:
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: peopleLeft }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-4 py-2 rounded-lg ${selectedNum === num
                  ? "bg-amber-600"
                  : "bg-amber-500 hover:bg-amber-600"
                  } text-white transition-colors`}
                onClick={() => {
                  setSelectedNum(num);
                  setShowConfirmation(true);
                }}
                disabled={loading}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Check-In</h2>
            <p className="mb-4">
              Are you sure you want to check in {selectedNum} people?
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                onClick={handleCheckIn}
                disabled={loading}
              >
                {loading ? "Checking in..." : "Confirm"}
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
