import { motion } from "framer-motion";
import TicketSelector from "./TicketSelector";
import TicketConfirmation from "./TicketConfirmation";
import { Event } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

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
  isButtonDisabled: boolean;
  setIsButtonDisabled: (disabled: boolean) => void;
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
  isButtonDisabled,
  setIsButtonDisabled
}: TicketAreaProps) {

  const handleButtonClick = () => {
    setIsButtonDisabled(true);
    lockTickets();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="w-auto my-6 p-4 md:p-6 bg-gray-900 rounded-lg shadow-lg mx-auto"
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
          onClick={handleButtonClick}
          className="w-full text-xs md:text-sm bg-amber-500 text-white font-bold py-3 rounded-lg transition-all mt-4"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
              Please wait
            </div>
          ) : (
            <>Confirm Passes</>
          )}
        </button>
      )}
    </motion.div>
  );
}
