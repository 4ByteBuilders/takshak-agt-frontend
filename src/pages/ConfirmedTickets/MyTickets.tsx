import { MapPin, Calendar, Ticket, Watch, Download } from "lucide-react";
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
import { ExtendedBooking } from "@/utils/interfaces";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import noTickets from "@/assets/no_tickets.json";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { generateStyledTicketPDF } from "@/services/ticketPDFGeneration";

const MyTickets = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = (await supabase.auth.getSession()).data.session
          ?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/booking/get-bookings"
        );
        setBookings(response.data);
      } catch {
        toast.error("Failed to fetch passes. Please try again later.");
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md shadow-md dark:shadow-lg">
          <CardContent className="p-6 text-center">
            <Lottie animationData={noTickets} className="w-40 h-40 m-auto" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
              No tickets found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Looks like you haven't booked any tickets yet. Don't miss out on
              exciting events!
            </p>
            <Button onClick={handleClick} className="mt-4" variant="default">
              Explore Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
            .event-details-card {
              display: none;
            }
            .event-details-card-mobile {
              display: block;
            }
          }
          @media screen and (min-width: 769px) {
            .event-details-card-mobile {
              display: none;
            }
          }
        `}
      </style>
      <div className="pt-20 h-full">
        <h1 className="text-center font-bold text-2xl">
          Scan the Pass at the Venue
        </h1>
        {bookings.map((booking) => {
          const event = booking.event;
          const totalTickets = booking.tickets.length;

          return (
            <div
              className="my-5 flex flex-col md:flex-row items-center justify-center md:mx-8 lg:mx-12 ticket-container"
              key={booking.id}
            >
              {/* QR Code Card */}
              <Card className="h-full bg-zinc-800 rounded-xl border-0 border-r-4 p-6 pb-2 md:my-5 sm:my-0 ticket-card">
                <div>
                  <QRCode
                    className="w-auto h-auto bg-white border-4 border-white rounded-lg m-auto"
                    value={booking.qrCode}
                  />
                </div>
                <div className="flex items-center justify-center mt-2">
                  <Ticket strokeWidth="1px" size="16px" className="mr-2" />
                  <CardDescription>{booking.qrCode}</CardDescription>
                </div>
              </Card>

              {/* Event Details Card for Large Screens */}
              <Card
                className="flex flex-col h-80
               rounded-xl bg-zinc-800 border-0 border-l-2 border-dashed border-stone-300 w-5/12 my-5 event-details-card"
              >
                <div className="flex flex-row justify-start">
                  <div className="flex justify-center items-center ml-3 mt-3 max-w-52">
                    <img
                      src={booking.event.photoUrls.eventPageUrl}
                      alt="eventImage"
                      className="rounded-lg h-40 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold ">
                      {event.title}
                    </CardTitle>
                    <div className="flex-row sm:flex justify-between mt-2">
                      <div>
                        <div className="flex items-center mt-2">
                          <MapPin
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription>{event.venue}</CardDescription>
                        </div>
                        <div className="flex items-center mt-2">
                          <Calendar
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription>
                            {formatDate(event.dateTime, "DD MMMM YYYY")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center mt-2">
                          <Watch
                            strokeWidth="1px"
                            size="16px"
                            className="mr-2"
                          />
                          <CardDescription>
                            {formatTime(event.dateTime, "hh:mm A")}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </div>

                {/* Ticket Information */}
                <CardContent>
                  <CardDescription className="mx-5 mt-8">
                    <div className="flex flex-row justify-between">
                      <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                        {totalTickets} Ticket(s)
                      </p>
                      <ul className="flex items-center justify-between gap-4">
                        {booking.priceDetails.map((priceDetail, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {priceDetail.quantity} x {priceDetail.name} (₹
                            {priceDetail.price})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardDescription>
                </CardContent>

                {/* Total Amount */}
                <CardContent>
                  <div className="flex flex-row justify-between items-center">
                    <Button variant={'outline'} onClick={() => generateStyledTicketPDF(booking)}>
                      <Download strokeWidth="1px" size="16px" className="mr-2" />
                      Download PDF
                    </Button>
                    <p>Grand Total ₹{booking.amountPaid}</p>
                  </div>

                </CardContent>
              </Card>

              {/* Event Details Card for Small Screens */}
              <Card className="max-w-[320px] flex flex-col h-full rounded-xl bg-zinc-800 border-0 border-t-2 border-dashed border-stone-300 mb-5 event-details-card-mobile">
                <div className="flex justify-center items-center mt-3">
                  <img
                    src={booking.event.photoUrls.eventPageUrl}
                    alt="eventImage"
                    className="rounded-lg w-11/12"
                  />
                </div>
                <CardHeader className="text-left">
                  <CardTitle className="text-xl font-bold">
                    {event.title}
                  </CardTitle>
                  <div className="flex flex-col items-start mt-2">
                    <div className="flex items-center mt-2">
                      <MapPin strokeWidth="1px" size="16px" className="mr-2" />
                      <CardDescription>{event.venue}</CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Calendar
                        strokeWidth="1px"
                        size="16px"
                        className="mr-2"
                      />
                      <CardDescription>
                        {new Date(event.dateTime).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Watch strokeWidth="1px" size="16px" className="mr-2" />
                      <CardDescription>
                        {formatTime(event.dateTime, "hh:mm A")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Ticket Information */}
                <CardContent>
                  <CardDescription className="mt-6">
                    <div className="flex flex-row justify-between">
                      <div>
                        <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                          {totalTickets} Ticket(s)
                        </p>
                      </div>
                      <ul className="flex flex-col items-end justify-between gap-4">
                        {booking.priceDetails.map((priceDetail, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {priceDetail.quantity} x {priceDetail.name} (₹
                            {priceDetail.price})
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
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyTickets;