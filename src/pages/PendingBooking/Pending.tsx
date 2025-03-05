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
import Loader from "@/components/Loader/Loader";
import Lottie from "lottie-react";
import noPendingAnimation from "@/assets/no_payments.json";
import { useNavigate } from "react-router-dom";

const Pending = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const cashfree = useRef<Cashfree | null>(null);

  const handleClick = () => {
    navigate("/");
  };
  useEffect(() => {
    const initializeSDK = async () => {
      cashfree.current = await load({ mode: "sandbox" });
    };
    initializeSDK();

    const fetchPendingBookings = async () => {
      try {
        setLoading(true);
        const auth = (await supabase.auth.getSession()).data.session
          ?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/booking/get-pending-bookings"
        );
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
    return <Loader />;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md shadow-md dark:shadow-lg">
          <CardContent className="p-6 text-center">
            <Lottie animationData={noPendingAnimation} className="h-40 mx-auto" loop={true} />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
              No Pending Payments
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              You have no pending bookings at the moment.
            </p>
            <Button onClick={handleClick} className="mt-4" variant="default">
              Browse Events
            </Button>
          </CardContent>
        </Card>
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
        const { event, amountPaid, paymentSessionId } = booking;

        return (
          <Card
            key={index}
            className="flex flex-col rounded-lg bg-gray-900 w-1/3 m-9 mx-auto"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {event?.title}
              </CardTitle>
              <div className="flex-row sm:flex justify-between mt-2">
                <div>
                  <div className="flex items-center mt-2">
                    <MapPin
                      strokeWidth={"1px"}
                      size={"16px"}
                      className="mr-2"
                    />
                    <CardDescription className="inline-block">
                      {event?.venue}
                    </CardDescription>
                  </div>
                  <div className="flex items-center mt-2">
                    <Calendar
                      strokeWidth={"1px"}
                      size={"16px"}
                      className="mr-2"
                    />
                    <CardDescription className="inline-block">
                      {new Date(event?.dateTime).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {event?.priceOfferings.map((offering, idx) => (
                    <div
                      key={idx}
                      className="flex flex-row items-center justify-between gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-xs font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                    >
                      <span>
                        {offering.name} x {offering.capacity}
                      </span>
                      <span>₹{offering.price * offering.capacity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-end mt-4">
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
