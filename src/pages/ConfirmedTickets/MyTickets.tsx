import React from "react";
import { MapPin, Calendar, Armchair } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code"; // Use default import for QRCode from react-qr-code

interface Ticket {
  id: string;
  eventId: string;
  bookingId: string | null;
  status: string;
  type: string;
  quantity: number;
  price: number;
}

interface Booking {
  id: string;
  userId: string;
  tickets: Ticket[];
  amountPaid: number;
  paymentStatus: string;
  paymentSessionId: string | null;
  createdAt: Date;
  numVerifiedAtVenue: number | null;
  qrCode: string;
}

interface Event {
  id: string;
  name: string;
  place: string;
  date: string;
  description: string;
  priceOfferings: { type: string; price: number }[];
  image: string;
  availability: { total: number; available: number };
}

const sampleConfirmedBookings: Booking[] = [
  {
    id: "1",
    userId: "user123",
    tickets: [
      {
        id: "t1",
        eventId: "1",
        bookingId: "1",
        status: "confirmed",
        type: "Stag",
        quantity: 2,
        price: 499,
      },
      {
        id: "t2",
        eventId: "1",
        bookingId: "1",
        status: "confirmed",
        type: "Couple",
        quantity: 1,
        price: 799,
      },
    ],
    amountPaid: 1797,
    paymentStatus: "confirmed",
    paymentSessionId: "session123",
    createdAt: new Date(),
    numVerifiedAtVenue: 2,
    qrCode: "unique-qrcode-1",
  },
  // Add more confirmed bookings if needed
];

const Event: Event[] = [
  {
    id: "1",
    name: "RangBarse 2.0",
    place: "Swami Vivekananda Stadium, Agartala",
    date: "14th March 2025",
    description:
      "Get ready for the most vibrant and electrifying Holi celebration in Agartala! Immerse yourself in a festival of colors, music, and endless fun with live DJs, dance, and rain showers. Celebrate Holi like never before with organic colors, water guns, and a spectacular lineup of performances. Let’s make this festival a day to remember! 🔥",
    priceOfferings: [
      { type: "Stag", price: 499 },
      { type: "Couple", price: 799 },
    ],
    image: "/rangbarse.png",
    availability: { total: 500, available: 10 },
  },
  // Add more events if needed
];

const MyTickets = () => {
  const confirmedBookings = sampleConfirmedBookings.filter(
    (booking) => booking.paymentStatus === "confirmed"
  );

  if (confirmedBookings.length === 0) {
    return <div>No confirmed bookings found.</div>;
  }

  return (
    <>
      <div className="font-bold text-2xl mt-4 mx-20">
        <h1>Your confirmed tickets:</h1>
      </div>
      {confirmedBookings.map((booking) => {
        const event = Event.find((event) =>
          booking.tickets.some((ticket) => event.id === ticket.eventId)
        );

        if (!event) {
          return <div key={booking.id}>Event details not found.</div>;
        }

        return (
          <div className="m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:mx-8 lg:mx-12">
            <Card className="flex flex-col h-full rounded-lg transition duration-300 ease-in-out hover:border-stone-50">
              <div className="flex justify-center items-center">
                <img
                  src={event.image}
                  alt={event.name}
                  className="rounded-t-lg w-full h-40 object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {event.name}
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
                        {event.place}
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Calendar
                        strokeWidth={"1px"}
                        size={"16px"}
                        className="mr-2"
                      />
                      <CardDescription className="inline-block">
                        {event.date}
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2">
                      <Armchair
                        strokeWidth={"1px"}
                        size={"16px"}
                        className="mr-2"
                      />
                      <CardDescription className="inline-block">
                        {event.availability.available} /{" "}
                        {event.availability.total} available
                      </CardDescription>
                    </div>
                  </div>
                  <ul className="flex flex-row items-end sm:flex-col gap-4 mt-4">
                    {event.priceOfferings.map((priceDetail, idx) => (
                      <li
                        key={idx}
                        className="flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                      >
                        <span className="text-green-300">
                          {priceDetail.type}
                        </span>
                        <span className="text-xs font-bold">
                          {" "}
                          ₹{priceDetail.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardHeader>
              <CardContent className="min-h-[100px]">
                <CardDescription>
                  <p className="mt-2">{event.description}</p>
                </CardDescription>
              </CardContent>
              <CardContent>
                <Button className="bg-amber-500 text-white transition duration-300 ease-in-out hover:bg-amber-600">
                  View QR Code
                </Button>
                <div className="flex justify-center mt-4">
                  <QRCode value={booking.qrCode} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default MyTickets;
