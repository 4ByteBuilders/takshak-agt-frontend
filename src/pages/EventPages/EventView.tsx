import { useAuth } from "@/lib/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/dateFormatter";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import Lottie from "lottie-react";
import scrolldown from "@/assets/scroll_down.json";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getWithExpiry,
  removeLocalData,
  setWithExpiry,
} from "@/utils/fetchLocalStorage";

interface SelectedTickets {
  [key: string]: number;
}

export default function EventView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { event } = useEvent();
  const [showLockLoader, setShowLockLoader] = useState<boolean>(false);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
  const [ticketsLocked, setTicketsLocked] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingid, setBookingId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [availableTickets, setAvailableTickets] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const handleTicketChange = (type: string, value: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const updateAvailableTicketCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/event/get-available-tickets`,
        {
          params: {
            eventId: event!.id,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setAvailableTickets(response.data.availableTicketCount);
      } else {
        toast("Failed to update number of passes available. Please try again.");
      }
    } catch (err) {
      console.error("Error updating tickets count:", err);
      toast("Something went wrong.");
    }
  };

  useEffect(() => {
    let retrievedTickets = null;
    try {
      retrievedTickets = JSON.parse(getWithExpiry("selectedTickets"));
    } catch {
      toast.error("Error retrieving selected passes.");
    }
    if (!retrievedTickets) return;
    setSelectedTickets(retrievedTickets);
  }, []);

  useEffect(() => {
    if (event)
      updateAvailableTicketCount();
  }, [event]);

  const calculateAndSetGrandTotal = () => {
    let totalAmount = 0;
    for (const [key, value] of Object.entries(selectedTickets)) {
      const ticket = event?.priceOfferings.find(
        (priceOffering) => priceOffering.id === key
      );
      if (!ticket) continue;
      totalAmount += value * ticket!.price;
    }
    setGrandTotal(totalAmount);
  };

  const cancelLockedTickets = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/cancel-booking`,
        {
          bookingId: bookingid,
        }
      );
      if (response.status === 200) {
        toast("Passes cancelled successfully.");
        setTicketsLocked(false);
        setSelectedTickets({});
        setBookingTime(null);
      } else {
        toast("Failed to cancel passes. Please try again.");
      }
    } catch (err) {
      console.error("Error cancelling passes:", err);
      toast("Something went wrong.");
    }
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = "/view-event";
    const redirectTo = `${window.location.origin}${redirectUrl}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) toast.error(error.message);
  };

  const lockTickets = async () => {
    if (!user) {
      setWithExpiry(
        "selectedTickets",
        JSON.stringify(selectedTickets),
        16 * 60 * 1000
      );
      setShowAlertDialog(true);
      return;
    }

    if (Object.values(selectedTickets).every((qty) => qty === 0)) {
      setShowDialog(true);
      return;
    }

    setShowLockLoader(true);
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
      console.log("Booking response:");
      console.log(response);
      if (response.status === 200) {
        removeLocalData("selectedTickets");
        setBookingTime(response.data.data.created_at);
        setBookingId(response.data.data.order_id);
        toast("Passes confirmed successfully.");
      } else {
        toast("Failed to confirm passes. Please try again.");
        setTicketsLocked(false);
      }
    } catch {
      toast("Something went wrong.");
      setTicketsLocked(false);
    } finally {
      setShowLockLoader(false);
    }
  };
  useEffect(() => {
    calculateAndSetGrandTotal();
  }, [selectedTickets, event]);
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
        console.log("Booking response:");
        console.log(response);
        if (response.data) {
          setTicketsLocked(true);
          setBookingTime(response.data.createdAt);
          setBookingId(response.data.id);
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
      const timerCleanUp = () => clearInterval(interval);
      return timerCleanUp;
    };
    const cleanupFunction = timer();
    return cleanupFunction;
  }, [bookingTime]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!event) {
    return <Skeleton className="w-full h-screen" />;
  }

  const backgroundStyle = {
    backgroundColor: `rgba(3, 7, 18, ${Math.max(scrollY / 300, 0.5)})`,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full"
      >
        <div
          className="w-full h-screen bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url(/rangbarse.png)",
            backgroundPosition: "bottom",
            backgroundAttachment: "fixed",
          }}
        />
        <div
          className="absolute inset-0 flex flex-row text-start"
          style={backgroundStyle}
        >
          <div className="flex flex-col justify-end text-start p-10">
            <h1 className="text-7xl font-bold transition-transform duration-300">
              {event.title}
            </h1>
            <p className="text-lg md:text-xl text-pretty font-sans text-muted-foreground transition-transform duration-300">
              {formatDate(event.dateTime, "DD MMMM YYYY")} | {event.venue}
            </p>
          </div>
          <div className={scrollY > 0 ? "hidden p-10" : "flex items-end p-10"}>
            <Lottie
              animationData={scrolldown}
              style={{ width: 50, height: 50 }}
            />
          </div>
        </div>
      </motion.div>
      {/* Event Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="rounded-lg shadow-lg text-center"
      >
        <p className="text-lg md:text-xl px-4">{event.description}</p>
        <div className="flex items-center justify-center">
          <p className="text-lg md:text-xl text-amber-300">
            {availableTickets} passes left
          </p>
          <Button
            variant={"link"}
            className="text-amber-300 font-bold"
            onClick={async () => {
              setShowLockLoader(true);
              await updateAvailableTicketCount();
              setShowLockLoader(false);
            }}
          >
            <RefreshCw
              className={`w-5 h-5 ${showLockLoader ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </motion.div>

      {/* Ticket Selection */}
      {showLockLoader ? (
        <Skeleton className="h-60 w-96 md:w-1/3 my-6 p-6" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl my-6 p-4 md:p-6 bg-gray-900 rounded-lg shadow-lg mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {!ticketsLocked ? "Select Your Passes" : "You Have Selected"}
          </h2>
          {event.priceOfferings.map(({ id, name, price, capacity }) => (
            <div key={id} className="flex justify-between items-center mb-4">
              <div
                className={
                  !ticketsLocked
                    ? "flex flex-row items-center justify-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 shadow-xl rounded-xl px-2 py-1 md:mx-5 text-xs md:text-base font-semibold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                    : "flex flex-row items-center justify-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-xs md:text-sm font-semibold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] w-40 md:w-64"
                }
              >
                <span className="text-white">{name}</span>
                <span className="text-xs md:text-sm"> ₹{price}</span>
                <span className="text-xs md:text-sm ">
                  {`(${capacity} ${capacity == 1 ? "person" : "people"})`}
                </span>
              </div>
              <div className="flex items-center mx-3 md:mx-5">
                {!ticketsLocked && (
                  <button
                    className="px-2 text-xs md:text-sm md:px-3 py-1 bg-gray-700 rounded-l"
                    onClick={() =>
                      handleTicketChange(id, (selectedTickets[id] || 0) - 1)
                    }
                    disabled={selectedTickets[id] === 0 || ticketsLocked}
                  >
                    -
                  </button>
                )}
                <span className="px-2 text-xs md:text-sm md:px-4 mx-2 bg-gray-800 text-white rounded">
                  {selectedTickets[id] || 0}
                </span>
                {!ticketsLocked && (
                  <button
                    className="px-2 text-xs md:text-sm md:px-3 py-1 bg-gray-700 rounded-r"
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
                )}
              </div>
            </div>
          ))}

          {/* Lock Tickets Button */}
          {!ticketsLocked ? (
            <button
              onClick={lockTickets}
              className="w-full text-xs md:text-sm bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
            >
              Confirm Passes
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-4"
            >
              <p className="text-green-400 text-lg font-semibold">
                Passes Confirmed!
              </p>
              <p>Cancel to change selections</p>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-lg font-semibold">
                  Time Left: <span className="text-amber-500">{timeLeft}</span>
                </p>
              </div>
              <motion.button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-4 flex items-center justify-center gap-2"
                onClick={() => navigate("/pending-booking")}
              >
                <span>Proceed to Pay: ₹{grandTotal}</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </motion.button>

              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
                onClick={cancelLockedTickets}
              >
                Cancel
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Alert Dialog for login */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You have to sign in with google to lock tickets.
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will redirect you to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoogleLogin}>
              Sign In with Google
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for no ticket selection */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't selected any passes.
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
