import { MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { load, Cashfree } from "@cashfreepayments/cashfree-js";
import { supabase } from "@/supabaseClient";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Booking } from "@/utils/interfaces";

const Pending = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const cashfree = useRef<Cashfree | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      cashfree.current = await load({ mode: "sandbox" });
    };
    initializeSDK();

    const fetchPendingBookings = async () => {
      try {
        setLoading(true);
        const auth = (await supabase.auth.getSession()).data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/booking/get-pending-bookings");

        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-2xl font-semibold">No pending payments</h2>
        <p className="text-gray-400 mt-2">You have no pending bookings at the moment.</p>
      </div>
    );
  }

  const doPayment = async (paymentSessionId: string) => {
    if (cashfree.current && paymentSessionId) {
      cashfree.current.checkout({ paymentSessionId, redirectTarget: "_self" });
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-grey-950">
      <div className="font-bold text-2xl w-1/3 mt-10 mx-auto">
        <h1>Your pending payments:</h1>
      </div>
      {bookings.map((booking, index) => {
        const { event, priceOfferingSelected, amountPaid, paymentSessionId } = booking;
        const tickets = Object.entries(priceOfferingSelected || {}).map(([ticketType, quantity]) => ({
          type: ticketType,
          quantity,
        }));

        return (
          <Card key={index} className="flex flex-col rounded-lg bg-gray-900 w-1/3 m-9 mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{event?.title}</CardTitle>
              <div className="flex-row sm:flex justify-between mt-2">
                <div>
                  <div className="flex items-center mt-2">
                    <MapPin strokeWidth={"1px"} size={"16px"} className="mr-2" />
                    <CardDescription className="inline-block">{event?.venue}</CardDescription>
                  </div>
                  <div className="flex items-center mt-2">
                    <Calendar strokeWidth={"1px"} size={"16px"} className="mr-2" />
                    <CardDescription className="inline-block">
                      {new Date(event?.dateTime).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <ul className="flex flex-row items-end sm:flex-col gap-4 mt-4">
                  {tickets.map((ticket, idx) => (
                    <li
                      key={idx}
                      className="flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                    >
                      <span className="text-green-300">{ticket.type}</span>
                      <span className="text-xs font-bold">x {ticket.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-end">
                <Button
                  onClick={() => doPayment(paymentSessionId!)}
                  className="bg-amber-500 text-white transition duration-300 ease-in-out hover:bg-amber-600"
                >
                  Checkout and pay ₹{amountPaid} →
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Pending;
