import { MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import { Booking, UnparsedBooking } from "@/utils/interfaces";
interface ExtendedBooking extends Booking {
  priceDetails: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

const MyTickets = () => {
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = (await supabase.auth.getSession()).data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/booking/get-bookings");
        const parsedBookings = response.data.map((booking: UnparsedBooking) => ({
          ...booking,
          event: {
            ...booking.event,
            photoUrls: JSON.parse(booking.event.photoUrls),
          },
        }));
        console.log(parsedBookings);
        setBookings(parsedBookings);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch tickets. Please try again later.");
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (bookings.length === 0) {
    return <div>No confirmed bookings found.</div>;
  }

  return (
    <>
      <style>
        {`
          @media screen and (max-width: 768px) {
            .ticket-container {
              overflow-x: auto;
              white-space: nowrap;
            }
            .ticket-card {
              display: inline-block;
              vertical-align: top;
            }
          }
        `}
      </style>
      <div className="font-bold text-2xl mt-4 mx-12">
        <h1>Confirmed tickets:</h1>
      </div>
      {bookings.map((booking) => {
        const event = booking.event;
        const totalTickets = booking.tickets.length;

        return (
          <div
            className="min-h-full m-5 flex flex-col md:flex-row items-stretch justify-center md:mx-8 lg:mx-12 ticket-container"
            key={booking.id}
          >
            {/* QR Code Card */}
            <Card className="h-full bg-zinc-800 rounded-xl border-0 border-r-4 p-6">
              <div className="h-1/3">
                <QRCode
                  className="bg-white border-4 border-white rounded-lg m-auto"
                  value={booking.qrCode}
                />
              </div>
            </Card>

            {/* Event Details Card */}
            <Card className="flex flex-col h-full rounded-xl bg-zinc-800 border-0 border-l-2 border-dashed border-stone-300 w-5/12">
              <div className="flex flex-row justify-start">
                <div className="flex justify-center items-center ml-3 mt-3 max-w-52">
                  <img src={booking.event.photoUrls.eventPageImageUrl} alt="eventImage" className="rounded-lg h-40 object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                  <div className="flex-row sm:flex justify-between mt-2">
                    <div>
                      <div className="flex items-center mt-2">
                        <MapPin strokeWidth="1px" size="16px" className="mr-2" />
                        <CardDescription>{event.venue}</CardDescription>
                      </div>
                      <div className="flex items-center mt-2">
                        <Calendar strokeWidth="1px" size="16px" className="mr-2" />
                        <CardDescription>{new Date(event.dateTime).toLocaleString()}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </div>

              {/* Ticket Information */}
              <CardContent>
                <CardDescription className="mx-5 mt-6">
                  <div className="flex flex-row justify-between">
                    <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                      {totalTickets} Ticket(s)
                    </p>
                    <ul className="flex items-center justify-between gap-4">
                      {booking.priceDetails.map((priceDetail, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          {priceDetail.quantity} x {priceDetail.name} (₹{priceDetail.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardDescription>
              </CardContent>

              {/* Total Amount */}
              <CardContent>
                <div className="flex flex-row justify-end">
                  <p>Grand Total ₹{booking.amountPaid}</p>
                </div>
              </CardContent>
            </Card>
          </div >
        );
      })}
    </>
  );
};

export default MyTickets;
