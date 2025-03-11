import { MapPin, Calendar, Watch, RefreshCwIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { load, Cashfree } from "@cashfreepayments/cashfree-js";
import { supabase } from "@/supabaseClient";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Booking } from "@/utils/interfaces";
import Loader from "@/components/Loader/Loader";
import Lottie from "lottie-react";
import noPendingAnimation from "@/assets/no_payments.json";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { setWithExpiry } from "@/utils/fetchLocalStorage";
import { toast } from "sonner";

const Pending = () => {
  const [isIOS, setIsIOS] = useState(
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  );
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const cashfree = useRef<Cashfree | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleClick = () => {
    navigate("/");
  };
  const handleRaiseConcern = (order_id: string) => {
    const TTL = 10 * 60 * 1000; // 10 minutes expiry
    setWithExpiry("booking_id", order_id, TTL);
    window.location.href = "/raise-concern"; // Redirect to the page
  };
  useEffect(() => {
    const initializeSDK = async () => {
      cashfree.current = await load({ mode: "production" });
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
      } catch {
        toast.error("Failed to fetch pending bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const refreshBookingStatus = async (order_id: string) => {
    try {
      setLoading(true);
      const auth = (await supabase.auth.getSession()).data.session
        ?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/booking/payment-status",
        { params: { order_id } }
      );

      if (response.data.payment_status === "SUCCESS") {
        navigate(`/payment-status?order_id=${order_id}`);
      } else {
        setCurrentOrderId(order_id); // Set the current order_id
        setIsDialogOpen(true); // Open the dialog if status is not "SUCCESS"
      }
    } catch {
      toast.error("Error refreshing booking status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md shadow-md dark:shadow-lg">
          <CardContent className="p-6 text-center">
            <Lottie
              animationData={noPendingAnimation}
              className="h-40 mx-auto"
              loop={true}
            />
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
    <div className="flex flex-col min-h-full bg-grey-950 pt-12">
      {isIOS && (
        <Dialog open={isIOS} onOpenChange={() => setIsIOS(true)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Important: iOS - Enable Pop-ups for Payments
              </DialogTitle>
            </DialogHeader>
            <p>
              Since you're using an iOS device and Safari, pop-ups must be
              enabled for payment. Follow these steps: <br />
              1. Open <strong>Settings</strong> and tap <strong>Safari</strong>.
              <br />
              2. Scroll to <strong>Block Pop-ups</strong> under "General".{" "}
              <br />
              3. Toggle it <strong>OFF</strong>. <br />
              4. Press OK and proceed with payment.
            </p>

            <DialogFooter>
              <Button onClick={() => setIsIOS(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="font-bold text-2xl mt-10 mx-auto">
        <h1>Your pending payments</h1>
      </div>
      {bookings.map((booking, index) => {
        const { event, amountPaid, paymentSessionId, id: order_id } = booking;
        const totalAmount = amountPaid + amountPaid * 0.023; // Calculate total amount including platform fee
        return (
          <Card
            key={index}
            className="flex flex-col rounded-lg bg-zinc-900 md:w-1/3 sm:w-5/6 m-9 mx-auto"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {event?.title}
              </CardTitle>
              <div className="flex-row sm:flex justify-between items-end mt-2">
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
                      {formatDate(event?.dateTime, "DD MMMM YYYY")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center mt-2">
                    <Watch strokeWidth={"1px"} size={"16px"} className="mr-2" />
                    <CardDescription className="inline-block">
                      {formatTime(event?.dateTime, "hh:mm A")}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between md:mt-4 sm:mt-1 gap-2">
                <div className="flex flex-row justify-center items-center rounded-lg px-1 border-2 hover:border-orange-400">
                  <RefreshCwIcon className="text-orange-400" />
                  <Button
                    onClick={() => refreshBookingStatus(order_id)}
                    variant="ghost"
                    className="text-orange-400  px-1 hover:bg-inherit hover:text-orange-400 "
                  >
                    Refresh Status
                  </Button>
                </div>
                <Button
                  onClick={() => doPayment(paymentSessionId!)}
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  Checkout and pay ₹{totalAmount.toFixed(2)} →
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Payment Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Status Unconfirmed</DialogTitle>
          </DialogHeader>
          <p>
            It seems like we are unable to confirm your payment status right
            now. If any amount has been deducted, please raise a concern.
          </p>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-orange-500 text-white hover:bg-orange-700 "
                onClick={() => {
                  setIsDialogOpen(false);
                  if (currentOrderId) {
                    handleRaiseConcern(currentOrderId);
                  }
                }}
              >
                Raise Concern
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                OK
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pending;
