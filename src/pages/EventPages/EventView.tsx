import { useAuth } from "@/lib/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useEvent } from "../../lib/Providers/EventProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/dateFormatter";
import { supabase } from "@/supabaseClient";
import axios from "axios";

interface SelectedTickets {
  [key: string]: number;
}

export default function EventView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { event } = useEvent();
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
  const [ticketsLocked, setTicketsLocked] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const handleTicketChange = (type: string, value: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const lockTickets = async () => {
    if (!user) {
      toast.custom(() => (
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
          You are not logged in.
        </div>
      ));
      navigate("/login");
      return;
    }

    if (Object.values(selectedTickets).every((qty) => qty === 0)) {
      setShowDialog(true);
      return;
    }

    setTicketsLocked(true);

    try {
      const { data } = await supabase.auth.getSession();
      const auth = data.session?.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/create-order`,
        {
          eventId: event!.id,
          priceOfferings: selectedTickets,
        }
      );

      if (response.status === 200) {
        setBookingTime(response.data.createdAt);

        toast("Tickets locked successfully.");
      } else {
        toast("Failed to lock tickets. Please try again.");
        setTicketsLocked(false);
      }
    } catch (err) {
      console.error("Error locking tickets:", err);
      toast("Something went wrong.");
      setTicketsLocked(false);
    }
  };

  useEffect(() => {

    const getBooking = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const auth = data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/booking/get-pending-bookings`,
          {
            params: {
              eventId: event!.id,
            },
          }
        );
        if (response.data) {
          setTicketsLocked(true);
          setBookingTime(response.data.createdAt);
          const parsedPriceOfferings = JSON.parse(
            response.data.priceOfferingSelected
          );
          setSelectedTickets(parsedPriceOfferings);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    if (event) {
      getBooking();
    }
  }, [event]);

  useEffect(() => {
    const timer = () => {
      if (bookingTime === null) return;
      const createdAt = new Date(bookingTime);
      const expiryTime = new Date(createdAt.getTime() + 16 * 60000);

      const updateTimer = () => {
        const now = new Date();
        const difference = expiryTime.getTime() - now.getTime();

        if (difference > 0) {
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft("Expired");
          clearInterval(interval);
        }
      };

      const interval = setInterval(updateTimer, 1000);
      updateTimer();

      return () => clearInterval(interval);
    };
    timer();
  }, [bookingTime]);

  if (!event) {
    return <Skeleton className="w-full h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full"
      >
        <img
          src={event.photoUrls.eventPageUrl}
          alt="Event"
          className="w-full h-96 sticky top-0 left-0 object-cover rounded-lg shadow-lg z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end text-start rounded-lg z-8">
          <h1 className="text-4xl font-bold mx-4">{event.title}</h1>
          <p className="text-pretty font-sans mx-4 my-2 text-muted-foreground">
            {formatDate(event.dateTime, "DD MMMM YYYY")} | {event.venue}
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
          {event.totalNumberOfTickets} total tickets
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
        {event.priceOfferings.map(({ id, name, price, capacity }) => (
          <div key={id} className="flex justify-between items-center mb-4">
            <div
              className={
                !ticketsLocked
                  ? "flex flex-row items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 shadow-xl rounded-xl px-2 py-1 mx-5 text-sm font-semibold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  : "flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-    md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              }
            >
              <span className="text-white">{name}</span>
              <span className="text-xs font-bold"> ₹{price}</span>
              <span className="text-xs font-bold"> {capacity} person(s)</span>
            </div>
            <div className="flex items-center mx-5">
              <button
                className="px-3 py-1 bg-gray-700 rounded-l"
                onClick={() =>
                  handleTicketChange(id, (selectedTickets[id] || 0) - 1)
                }
                disabled={selectedTickets[id] === 0 || ticketsLocked}
              >
                -
              </button>
              <span className="px-4">{selectedTickets[id] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-700 rounded-r"
                onClick={() =>
                  handleTicketChange(id, (selectedTickets[id] || 0) + 1)
                }
                disabled={
                  selectedTickets[id] === event.totalNumberOfTickets ||
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
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-lg font-semibold">
                Time Left: <span className="text-amber-500">{timeLeft}</span>
              </p>
            </div>
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
