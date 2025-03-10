import { motion } from "framer-motion";
import TicketSelector from "./TicketSelector";
import TicketConfirmation from "./TicketConfirmation";
import { Event } from "@/utils/interfaces";

interface SelectedTickets {
  [key: string]: number;
}

interface TicketAreaProps {
  event: Event;
  ticketsLocked: boolean;
  selectedTickets: SelectedTickets;
  handleTicketChange: (type: string, value: number) => void;
  grandTotal: number;
  lockTickets: () => void;
  cancelLockedTickets: () => void;
  timeLeft: string;
  onProceed: () => void;
}

export default function TicketArea({
  event,
  ticketsLocked,
  selectedTickets,
  handleTicketChange,
  grandTotal,
  lockTickets,
  cancelLockedTickets,
  timeLeft,
  onProceed,
}: TicketAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="my-6 md:p-6 bg-gray-900 rounded-lg shadow-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {!ticketsLocked ? "Select Your Passes" : "You Have Selected"}
      </h2>
      {ticketsLocked ? (
        <TicketConfirmation
          event={event}
          timeLeft={timeLeft}
          selectedTickets={selectedTickets}
          grandTotal={grandTotal}
          cancelLockedTickets={cancelLockedTickets}
          onProceed={onProceed}
        />
      ) : (
        <TicketSelector
          event={event}
          selectedTickets={selectedTickets}
          handleTicketChange={handleTicketChange}
        />
      )}
      {!ticketsLocked && (
        <button
          onClick={lockTickets}
          className="w-full text-xs md:text-sm bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
        >
          Confirm Passes
        </button>
      )}
    </motion.div>
  );
}
