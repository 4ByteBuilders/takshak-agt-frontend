
import { MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  {
    id: "2",
    userId: "user456",
    tickets: [
      {
        id: "t3",
        eventId: "2",
        bookingId: "2",
        status: "failed",
        type: "VIP",
        quantity: 1,
        price: 999,
      },
    ],
    amountPaid: 999,
    paymentStatus: "failed",
    paymentSessionId: "session456",
    createdAt: new Date(),
    numVerifiedAtVenue: 0,
    qrCode: "unique-qrcode-2",
  },
  {
    id: "3",
    userId: "user789",
    tickets: [
      {
        id: "t4",
        eventId: "3",
        bookingId: "3",
        status: "expired",
        type: "General",
        quantity: 3,
        price: 299,
      },
    ],
    amountPaid: 897,
    paymentStatus: "expired",
    paymentSessionId: "session789",
    createdAt: new Date(),
    numVerifiedAtVenue: 0,
    qrCode: "unique-qrcode-3",
  },
  {
    id: "4",
    userId: "user101",
    tickets: [
      {
        id: "t5",
        eventId: "4",
        bookingId: "4",
        status: "completed",
        type: "General",
        quantity: 2,
        price: 399,
      },
    ],
    amountPaid: 798,
    paymentStatus: "completed",
    paymentSessionId: "session101",
    createdAt: new Date(),
    numVerifiedAtVenue: 2,
    qrCode: "unique-qrcode-4",
  },
  // Add more bookings if needed
];

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
  {
    id: "2",
    name: "VIP Concert",
    place: "City Arena, Mumbai",
    date: "20th April 2025",
    description:
      "Experience the ultimate VIP concert with exclusive access, premium seating, and unforgettable performances by top artists. Enjoy a night of luxury and entertainment like never before.",
    priceOfferings: [
      { type: "VIP", price: 999 },
      { type: "General", price: 499 },
    ],
    image: "/vip-concert.png",
    availability: { total: 300, available: 50 },
  },
  {
    id: "3",
    name: "General Admission Event",
    place: "Open Grounds, Delhi",
    date: "5th May 2025",
    description:
      "Join us for a day of fun and excitement at the General Admission Event. Enjoy live music, food stalls, and various activities for all ages. Don't miss out on this amazing experience!",
    priceOfferings: [
      { type: "General", price: 299 },
      { type: "VIP", price: 799 },
    ],
    image: "/general-admission.png",
    availability: { total: 1000, available: 200 },
  },
  {
    id: "4",
    name: "Music Festival",
    place: "Beachside, Goa",
    date: "10th June 2025",
    description:
      "Join us for an unforgettable music festival at the beautiful beachside of Goa. Enjoy live performances by top artists, beach activities, and a vibrant atmosphere. Don't miss out on this amazing experience!",
    priceOfferings: [
      { type: "General", price: 399 },
      { type: "VIP", price: 999 },
    ],
    image: "/music-festival.png",
    availability: { total: 800, available: 100 },
  },
  // Add more events if needed
];

const History = () => {
  const failedOrExpiredBookings = sampleConfirmedBookings.filter(
    (booking) =>
      booking.paymentStatus === "failed" || booking.paymentStatus === "expired"
  );

  const completedBookings = sampleConfirmedBookings.filter(
    (booking) => booking.paymentStatus === "completed"
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4">Failed or Expired Bookings</h2>
      {failedOrExpiredBookings.length === 0 ? (
        <div>No failed or expired bookings found.</div>
      ) : (
        failedOrExpiredBookings.map((booking) => {
          const event = sampleEvents.find((event) =>
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
            <div className="flex flex-col mx-10">
              <Card
                key={booking.id}
                className="flex flex-col h-full rounded-xl bg-gray-800 m-4"
              >
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
                    <p>Grand Total {booking.amountPaid}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })
      )}

      <h2 className="text-2xl font-bold mt-8">Completed Bookings</h2>
      {completedBookings.length === 0 ? (
        <div>No completed bookings found.</div>
      ) : (
        completedBookings.map((booking) => {
          const event = sampleEvents.find((event) =>
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
            <Card
              key={booking.id}
              className="flex flex-col h-full rounded-xl bg-gray-800"
            >
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
                  <p>Grand Total {booking.amountPaid}</p>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default History;
