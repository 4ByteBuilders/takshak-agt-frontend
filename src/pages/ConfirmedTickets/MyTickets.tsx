import { MapPin, Calendar, Armchair } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

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
      <div className="font-bold text-2xl mt-4 mx-12">
        <h1>Confirmed tickets:</h1>
      </div>
      {confirmedBookings.map((booking) => {
        const event = Event.find((event) =>
          booking.tickets.some((ticket) => event.id === ticket.eventId)
        );

        if (!event) {
          return <div key={booking.id}>Event details not found.</div>;
        }
        const totalTickets = booking.tickets.reduce(
          (total, ticket) => total + ticket.quantity,
          0
        );
        return (
          <div className="min-h-full m-5 flex flex-row items-stretch justify-center md:mx-8 lg:mx-12">
            <Card className="h-full bg-gray-800 rounded-xl border-0 border-r-4 p-6">
              <div className="h-1/3">
                <QRCode
                  className="bg-white border-4 border-white rounded-lg m-auto"
                  value={booking.qrCode}
                />
              </div>
            </Card>
            <Card className="flex flex-col h-full rounded-xl bg-gray-800 border-0 border-l-4 border-dashed border-stone-100">
              <div className="flex flex-row justify-start">
                <div className="flex justify-center items-center max-w- ml-3 mt-3 max-w-52">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="rounded-lg h-40 object-cover"
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
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent>
                <CardDescription className="mx-5 mt-6">
                  <div className="flex flex-row justify-between">
                    <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                      {totalTickets} Ticket
                    </p>
                    <ul className="flex items-center justify-between gap-4">
                      {booking.tickets.map((ticket, idx) => (
                        <li key={idx} className="text-muted-foregorund">
                          {ticket.quantity} x {ticket.type} (₹{ticket.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent>
                <div className="flex flex-row justify-end">
                  <p>Grand Total {sampleConfirmedBookings[0].amountPaid}</p>
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
