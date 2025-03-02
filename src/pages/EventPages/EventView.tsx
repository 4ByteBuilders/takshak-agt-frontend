import { useAuth } from "@/lib/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define types for event details
interface PriceOffering {
  type: string;
  price: number;
}

interface Event {
  name: string;
  place: string;
  date: string;
  description: string;
  priceOfferings: PriceOffering[];
  image: string;
  availability: {
    total: number;
    available: number;
  };
}

// Define type for selected tickets
interface SelectedTickets {
  [key: string]: number;
}

interface EventViewProps {
  selectedTickets: SelectedTickets;
  setSelectedTickets: React.Dispatch<React.SetStateAction<SelectedTickets>>;
  ticketsLocked: boolean;
  setTicketsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EventView({
  selectedTickets,
  setSelectedTickets,
  ticketsLocked,
  setTicketsLocked,
}: EventViewProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const event: Event = {
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
  };

  const [showDialog, setShowDialog] = useState<boolean>(false);

  // Handle Ticket Selection
  const handleTicketChange = (type: string, value: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, value), // Prevent negative values
    }));
    console.log(selectedTickets);
  };

  // Lock Tickets
  const lockTickets = () => {
    if (!user) {
      toast("You are not logged in.");
      navigate("/login");
      window.scrollTo(0, 0);
    } else {
      if (Object.values(selectedTickets).some((qty) => qty > 0)) {
        setTicketsLocked(true);
      } else {
        setShowDialog(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
      {/* Event Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full"
      >
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
      </motion.div>
      {/* Event Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mx-10 mt-3 p-6 rounded-lg shadow-lg text-center"
      >
        <p className="text-lg">{event.description}</p>
        <p className="mt-2 text-yellow-400">
          {event.availability.available} tickets available
        </p>
      </motion.div>

      {/* Ticket Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-3xl my-6 p-6 bg-gray-900 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Select Your Tickets
        </h2>
        {event.priceOfferings.map(({ type, price }) => (
          <div key={type} className="flex justify-between items-center mb-4">
            <div
              className={
                !ticketsLocked
                  ? "flex flex-row items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 shadow-xl rounded-xl px-2 py-1 mx-5 text-sm font-semibold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  : "flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              }
            >
              <span className="text-white">{type}</span>
              <span className="text-xs font-bold"> ₹{price}</span>
            </div>
            <div className="flex items-center mx-5">
              <button
                className="px-3 py-1 bg-gray-700 rounded-l"
                onClick={() =>
                  handleTicketChange(type, (selectedTickets[type] || 0) - 1)
                }
                disabled={selectedTickets[type] === 0 || ticketsLocked}
              >
                -
              </button>
              <span className="px-4">{selectedTickets[type] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-700 rounded-r"
                onClick={() =>
                  handleTicketChange(type, (selectedTickets[type] || 0) + 1)
                }
                disabled={
                  selectedTickets[type] === event.availability.available ||
                  ticketsLocked
                }
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Lock Tickets Button */}
        {!ticketsLocked ? (
          <button
            onClick={lockTickets}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            Lock Tickets
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-4"
          >
            <p className="text-green-400 text-lg font-semibold">
              Tickets Locked!
            </p>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
              onClick={() => {
                navigate("/pending-booking");
              }}
            >
              Proceed to Payment →
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Alert Dialog for no ticket selection */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Please select at least one ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
