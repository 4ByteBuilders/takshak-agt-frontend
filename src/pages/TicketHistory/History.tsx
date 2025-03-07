import { useEffect, useState, useRef } from "react";
import { ExtendedBooking, Booking } from "@/utils/interfaces";
import {
  MapPin,
  Calendar,
  Watch,
  BadgeAlert,
  RefreshCwIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import Lottie from "lottie-react";
import noTickets from "@/assets/no_tickets.json";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { load, Cashfree } from "@cashfreepayments/cashfree-js";

const CombinedBookings = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const cashfree = useRef<Cashfree | null>(null);
  const dateNow = new Date();

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      cashfree.current = await load({ mode: "sandbox" });
    };
    initializeSDK();
  }, []);

  // Fetch both pending and history bookings concurrently
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const session = (await supabase.auth.getSession()).data.session;
        const auth = session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const [pendingResponse, historyResponse] = await Promise.all([
          axios.get(
            import.meta.env.VITE_BACKEND_URL + "/booking/get-pending-bookings"
          ),
          axios.get(
            import.meta.env.VITE_BACKEND_URL + "/booking/get-all-user-bookings"
          ),
        ]);

        if (pendingResponse.data && Array.isArray(pendingResponse.data)) {
          setPendingBookings(pendingResponse.data);
        } else {
          setPendingBookings([]);
        }

        if (historyResponse.status === 200) {
          setHistoryBookings(historyResponse.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const doPayment = async (paymentSessionId: string) => {
    if (cashfree.current && paymentSessionId) {
      cashfree.current.checkout({ paymentSessionId, redirectTarget: "_self" });
    }
  };
  const refreshBookingStatus = async (order_id: string) => {
    try {
      setLoading(true);
      const auth = (await supabase.auth.getSession()).data.session
        ?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/booking/payment-status",
        {
          params: { order_id },
        }
      );
      console.log(response);
      navigate(`/payment-status?order_id=${order_id}`);
    } catch (error) {
      console.error("Error refreshing booking status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  console.log(pendingBookings);
  console.log(historyBookings);
  return (
    <div className="min-h-full bg-grey-950 pt-12">
      {pendingBookings.length > 0 && (
        <>
          <div className="font-bold text-2xl mx-5 md:mx-8 lg:mx-12 mt-10">
            <h1>Pending Bookings</h1>
          </div>
          {pendingBookings.map((booking, index) => {
            const {
              event,
              amountPaid,
              paymentSessionId,
              id: order_id,
            } = booking;
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
                          strokeWidth="1px"
                          size="16px"
                          className="mr-2"
                        />
                        <CardDescription className="inline-block">
                          {event?.venue}
                        </CardDescription>
                      </div>
                      <div className="flex items-center mt-2">
                        <Calendar
                          strokeWidth="1px"
                          size="16px"
                          className="mr-2"
                        />
                        <CardDescription className="inline-block">
                          {formatDate(event?.dateTime, "DD MMMM YYYY")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center mt-2">
                        <Watch strokeWidth="1px" size="16px" className="mr-2" />
                        <CardDescription className="inline-block">
                          {formatTime(event?.dateTime, "hh:mm A")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end gap-2">
                      {event?.priceOfferings.map((offering, idx) => (
                        <div
                          key={idx}
                          className="w-fit flex flex-row items-center justify-end gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-xs font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
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
                  <div className="flex justify-between md:mt-4 sm:mt-1 gap-2">
                    <div
                      className="flex items-center rounded-lg px-1  border-2 hover:border-orange-400
                    "
                    >
                      <RefreshCwIcon className="text-orange-400" />
                      <Button
                        onClick={() => refreshBookingStatus(order_id)}
                        variant="ghost"
                        className="text-orange-400 px-1 hover:bg-inherit hover:text-orange-400 "
                      >
                        Refresh Status
                      </Button>
                    </div>
                    <Button
                      onClick={() => doPayment(paymentSessionId!)}
                      className="bg-amber-500 text-white hover:bg-amber-600"
                    >
                      Checkout and pay ₹{amountPaid} →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      {/* Booking History Section */}
      {historyBookings.filter((booking) => booking.paymentStatus !== "PENDING")
        .length === 0 && pendingBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-md shadow-md dark:shadow-lg">
            <CardContent className="p-6 text-center">
              <Lottie animationData={noTickets} className="w-40 h-40 m-auto" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
                No Booking History found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Looks like you haven't made any bookings yet. Don't miss out on
                exciting events!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="mt-4 bg-amber-500 text-zinc-100 hover:bg-amber-600"
                variant="default"
              >
                Explore Events
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className=" font-bold text-2xl mx-5 md:mx-8 lg:mx-12 mt-10">
            {historyBookings.filter(
              (booking) => booking.paymentStatus !== "PENDING"
            ).length > 0 && <h1>Your Booking History</h1>}
          </div>
          <div className="m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:mx-8 lg:mx-12">
            {historyBookings
              .filter((booking) => booking.paymentStatus !== "PENDING")
              .map((booking, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col h-fit rounded-lg bg-zinc-800 transition duration-300 ease-in-out hover:border-stone-50"
                >
                  <div className="relative">
                    <div
                      className={`absolute top-2 right-2 z-20 ${
                        booking.paymentStatus === "PAID"
                          ? "bg-green-700 backdrop-blur-md border border-green-400/50 rounded-xl px-2 py-1 text-sm font-semibold text-white"
                          : "bg-red-700 backdrop-blur-md border border-red-400/50 rounded-xl px-2 py-1 text-sm font-semibold"
                      }`}
                    >
                      {booking.paymentStatus === "PAID" &&
                        (dateNow > new Date(booking.event.dateTime) ? (
                          <span>Completed and </span>
                        ) : (
                          <span>Upcoming and </span>
                        ))}
                      {booking.paymentStatus[0] +
                        booking.paymentStatus.slice(1).toLowerCase()}
                    </div>
                    <div className="flex justify-center items-center">
                      <img
                        src={booking.event.photoUrls.eventPageUrl}
                        className="rounded-t-lg w-full h-40 object-cover filter brightness-75 z-0"
                        alt={booking.event.title}
                      />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {booking.event.title}
                    </CardTitle>
                    <div className="flex-col sm:flex justify-between mt-2">
                      <div>
                        <div className="flex items-center mt-2">
                          <MapPin
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription className="inline-block">
                            {booking.event.venue}
                          </CardDescription>
                        </div>
                        <div className="flex items-center mt-2">
                          <Calendar
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription className="inline-block">
                            {formatDate(booking.event.dateTime, "DD MMMM YYYY")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center mt-2">
                          <Watch
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription className="inline-block">
                            {formatTime(booking.event.dateTime, "hh:mm A")}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="mt-3">
                        <CardDescription className="text-md">
                          {booking.paymentStatus === "PAID"
                            ? "Booked on: " +
                              formatDate(booking.createdAt, "DD MMMM YYYY")
                            : "Booking tried on " +
                              formatDate(booking.createdAt, "DD MMMM YYYY")}
                        </CardDescription>
                      </div>
                      {booking.paymentStatus !== "PAID" ? (
                        <div className="flex flex-col md:flex-row justify-between items-end mt-4 gap-3">
                          <div className="flex items-start w-full md:w-auto gap-2">
                            <Button
                              className="text-amber-300 p-0"
                              variant="link"
                            >
                              <BadgeAlert />
                              Raise Concern
                            </Button>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <ul className="flex flex-col sm:flex-row items-end gap-4 mt-4 text-sm md:text-md">
                              {booking.priceDetails.map((priceDetail, idx) => (
                                <li key={idx} className="text-muted-foreground">
                                  {priceDetail.quantity} x {priceDetail.name} (₹
                                  {priceDetail.price})
                                </li>
                              ))}
                            </ul>
                            <p
                              className={
                                booking.paymentStatus === "PAID"
                                  ? "font-semibold text-green-400"
                                  : "font-semibold text-red-400"
                              }
                            >
                              {"Grand Total ₹" + booking.amountPaid}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-2 mb-4 text-sm md:text-md">
                          <ul className="flex flex-col sm:flex-row items-end gap-4 mt-4">
                            {booking.priceDetails.map((priceDetail, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                {priceDetail.quantity} x {priceDetail.name} (₹
                                {priceDetail.price})
                              </li>
                            ))}
                          </ul>
                          <p
                            className={
                              booking.paymentStatus === "PAID"
                                ? "font-semibold text-green-400"
                                : "font-semibold text-red-400"
                            }
                          >
                            {"Grand Total ₹" + booking.amountPaid}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CombinedBookings;
