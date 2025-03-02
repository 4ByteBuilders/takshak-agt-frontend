
import { MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Ticket {
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

const sampleEvents: Event[] = [
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

const sampleBookings: Booking[] = [
  {
    id: "1",
    userId: "user123",
    tickets: [
      { type: "Stag", quantity: 2, price: 499 },
      { type: "Couple", quantity: 1, price: 799 },
    ],
    amountPaid: 1797,
    paymentStatus: "pending",
    paymentSessionId: null,
    createdAt: new Date(),
    numVerifiedAtVenue: null,
    qrCode: "unique-qrcode-1",
  },
  // Add more bookings if needed
];

const Pending = () => {
  const pendingBooking = sampleBookings.find(
    (booking) => booking.paymentStatus === "pending"
  );

  if (!pendingBooking) {
    return <div>No pending bookings found.</div>;
  }

  const event = sampleEvents.find((event) =>
    pendingBooking.tickets.some((ticket) =>
      event.priceOfferings.some((offering) => offering.type === ticket.type)
    )
  );

  if (!event) {
    return <div>Event details not found.</div>;
  }

  const totalPrice = pendingBooking.tickets.reduce(
    (total, ticket) => total + ticket.quantity * ticket.price,
    0
  );

  return (
    <>
      {/*  */}
      <div className="flex flex-col min-h-full bg-grey-950 ">
        <div className="font-bold text-2xl w-1/3 mt-10 mx-auto">
          <h1>Your pending payment:</h1>
        </div>

        {/* <div className="relative w-full">
            <img
              src={event.image}
              alt="Event"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end text-start rounded-lg">
              <h1 className="text-4xl font-bold mx-4">{event.name}</h1>
              <p className="text-pretty font-sans mx-4 my-2 text-muted-foreground">
                {event.date} | {event.place}
              </p>
            </div>
          </div> */}
        <Card className="flex flex-col rounded-lg bg-gray-900 w-1/3 m-9 mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            <div className="flex-row sm:flex justify-between mt-2">
              <div>
                <div className="flex items-center mt-2">
                  <MapPin strokeWidth={"1px"} size={"16px"} className="mr-2" />
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
              <ul className="flex flex-row items-end sm:flex-col gap-4 mt-4">
                {pendingBooking.tickets.map((ticket, idx) => (
                  <li
                    key={idx}
                    className="flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                  >
                    <span className="text-green-300">{ticket.type}</span>
                    <span className="text-xs font-bold"> ₹{ticket.price}</span>
                    <span className="text-xs font-bold">
                      {" "}
                      x {ticket.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-end">
              <Button className="bg-amber-500 text-white transition duration-300 ease-in-out hover:bg-amber-600">
                Checkout and pay ₹{totalPrice} →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Pending;
