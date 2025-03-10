import { useEffect, useState } from "react";
import { useAuth } from "@/lib/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEvent } from "@/lib/Providers/EventProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import { getWithExpiry, removeLocalData, setWithExpiry } from "@/utils/fetchLocalStorage";

import EventHeader from "./EventHeader";
import EventDetails from "./EventDetails";
import TicketArea from "./TicketArea";
import LoginAlertDialog from "./LoginAlertDialog";
import NoSelectionAlertDialog from "./NoSelectionAlertDialog";
import PhoneNumberDialog from "./PhoneNumberDialog";

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
  const [showNoSelectionDialog, setShowNoSelectionDialog] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [availableTickets, setAvailableTickets] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState<boolean>(false);

  // Update available ticket count from backend
  const updateAvailableTicketCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/event/get-available-tickets`,
        { params: { eventId: event!.id } }
      );
      if (response.status === 200) {
        setAvailableTickets(response.data.availableTicketCount);
      } else {
        toast("Failed to update number of passes available. Please try again.");
      }
    } catch {
      toast("Error updating available tickets.");
    }
  };

  // Retrieve selected tickets from localStorage
  useEffect(() => {
    try {
      const retrievedTickets = JSON.parse(getWithExpiry("selectedTickets"));
      if (retrievedTickets) setSelectedTickets(retrievedTickets);
    } catch {
      toast.error("Error retrieving selected passes.");
    }
  }, []);

  // Update available tickets when event is available
  useEffect(() => {
    if (event) updateAvailableTicketCount();
  }, [event]);

  // Calculate the grand total
  const calculateAndSetGrandTotal = () => {
    let totalAmount = 0;
    if (event) {
      for (const [key, value] of Object.entries(selectedTickets)) {
        const ticket = event.priceOfferings.find(
          (priceOffering: { id: string; price: number }) => priceOffering.id === key
        );
        if (!ticket) continue;
        totalAmount += value * ticket.price;
      }
    }
    setGrandTotal(totalAmount);
  };

  // Cancel locked tickets
  const cancelLockedTickets = async () => {
    try {
      axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/cancel-booking`,
        { bookingId }
      );
      toast("Passes cancelled successfully.");
      setTicketsLocked(false);
      setSelectedTickets({});
      setBookingTime(null);
    } catch {
      toast("Failed to cancel passes. Please try again.");
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    const redirectUrl = "/view-event";
    const redirectTo = `${window.location.origin}${redirectUrl}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) toast.error(error.message);
  };

  // Handle ticket quantity changes
  const handleTicketChange = (type: string, value: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  // Lock tickets and create order
  const lockTickets = async () => {
    if (!user) {
      setWithExpiry("selectedTickets", JSON.stringify(selectedTickets), 16 * 60 * 1000);
      setShowLoginAlert(true);
      return;
    }
    if (Object.values(selectedTickets).every((qty) => qty === 0)) {
      setShowNoSelectionDialog(true);
      return;
    }
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/check-number`);
    if (!res.data) {
      setShowPhoneDialog(true);
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
        { eventId: event!.id, priceOfferings: selectedTickets }
      );
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

  // Retrieve pending booking if any
  useEffect(() => {
    const getBooking = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const auth = data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/booking/get-pending-bookings`,
          { params: { eventId: event!.id } }
        );
        if (response.data) {
          setTicketsLocked(true);
          setBookingTime(response.data.createdAt);
          setBookingId(response.data.id);
          const parsedPriceOfferings = JSON.parse(response.data.priceOfferingSelected);
          setSelectedTickets(parsedPriceOfferings);
        }
      } catch {
        toast.error("Failed to retrieve pending booking.");
      }
    };
    if (event) {
      getBooking();
    }
  }, [event]);

  // Calculate grand total when selections change
  useEffect(() => {
    calculateAndSetGrandTotal();
  }, [selectedTickets, event]);

  // Timer for booking expiration
  useEffect(() => {
    const timer = () => {
      if (bookingTime === null) return;
      const createdAt = new Date(bookingTime);
      const expiryTime = new Date(createdAt.getTime() + 16 * 60000);
      const updateTimer = () => {
        const now = new Date();
        const difference = expiryTime.getTime() - now.getTime();
        if (difference > 0) {
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
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
    const cleanupFunction = timer();
    return cleanupFunction;
  }, [bookingTime]);

  // Scroll listener for header effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshTicketCount = async () => {
    setShowLockLoader(true);
    await updateAvailableTicketCount();
    setShowLockLoader(false);
  };

  // When user clicks "Proceed to Pay", first check if phone exists.
  const handleProceedToPay = () => {
    navigate("/pending-booking");
  };

  if (!event) {
    return <Skeleton className="w-full h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
      <EventHeader event={event} scrollY={scrollY} />
      <EventDetails
        event={event}
        availableTickets={availableTickets}
        showLockLoader={showLockLoader}
        onRefresh={refreshTicketCount}
      />
      {showLockLoader ? (
        <Skeleton className="h-60 w-96 md:w-1/3 my-6 p-6" />
      ) : (
        <TicketArea
          event={event}
          ticketsLocked={ticketsLocked}
          selectedTickets={selectedTickets}
          handleTicketChange={handleTicketChange}
          grandTotal={grandTotal}
          lockTickets={lockTickets}
          cancelLockedTickets={cancelLockedTickets}
          timeLeft={timeLeft}
          onProceed={handleProceedToPay}
        />
      )}
      <LoginAlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert} onGoogleLogin={handleGoogleLogin} />
      <NoSelectionAlertDialog open={showNoSelectionDialog} onOpenChange={setShowNoSelectionDialog} />
      <PhoneNumberDialog
        open={showPhoneDialog}
        onOpenChange={setShowPhoneDialog}
        onSuccess={() => {
          setShowPhoneDialog(false);
        }}
      />
    </div>
  );
}
