import { useEffect, useState } from "react";
import { ExtendedBooking } from "@/utils/interfaces";
import { MapPin, Calendar } from "lucide-react";
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

const History = () => {
  const Navigate = useNavigate();
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const dateNow = new Date();
  useEffect(() => {
    const fetchAllUserBookings = async () => {
      try {
        const auth = (await supabase.auth.getSession()).data.session
          ?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/booking/get-all-user-bookings"
        );

        if (response.status === 200) {
          setBookings(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUserBookings();
  }, []);

  if (loading) {
    return <Loader />;
  }

  console.log(bookings.length === 0);
  console.log(bookings);

  if (bookings.length === 0) {
    return (
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
              onClick={() => {
                Navigate("/");
              }}
              className="mt-4 bg-amber-500 text-zinc-100 hover:bg-amber-600"
              variant="default"
            >
              Explore Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 m-5 h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:mx-8 lg:mx-12">
      {bookings.map((booking) => {
        if (booking.paymentStatus !== "PENDING") {
          return (
            <Card className="flex flex-col h-fit rounded-lg bg-zinc-800 transition duration-300 ease-in-out hover:border-stone-50">
              <div className="relative">
                <div
                  className={`absolute top-2 right-2 ${
                    booking.paymentStatus === "PAID"
                      ? "bg-green-700/40 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                      : "bg-red-700/40 backdrop-blur-md border border-red-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                  } `}
                >
                  {booking.paymentStatus === "PAID" &&
                    (dateNow > new Date(booking.event.dateTime) ? (
                      <span>Completed and </span>
                    ) : (
                      <span>Upcoming and </span>
                    ))}
                  {booking.paymentStatus.toString()[0] +
                    booking.paymentStatus.toString().slice(1).toLowerCase()}
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={booking.event.photoUrls.eventPageUrl}
                    className="rounded-t-lg w-full h-40 object-cover"
                  />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {booking.event.title}
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
                        {booking.event.venue}
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Calendar
                        strokeWidth={"1px"}
                        size={"16px"}
                        className="mr-2"
                      />
                      <CardDescription className="inline-block">
                        {formatDate(booking.event.dateTime, "DD MMMM YYYY")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Calendar
                        strokeWidth={"1px"}
                        size={"16px"}
                        className="mr-2"
                      />
                      <CardDescription className="inline-block">
                        {formatTime(booking.event.dateTime, "hh:mm A")}
                      </CardDescription>
                    </div>
                  </div>
                  <ul className="flex flex-row items-end sm:flex-col gap-4 mt-4">
                    {booking.priceDetails.map((priceDetail, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {priceDetail.quantity} x {priceDetail.name} (₹
                        {priceDetail.price})
                      </li>
                    ))}
                    <p className="font-semibold text-white">
                      {"Grand Total ₹" + booking.amountPaid}
                    </p>
                  </ul>
                </div>
              </CardHeader>
            </Card>
          );
        }
      })}
    </div>
  );
};

export default History;
