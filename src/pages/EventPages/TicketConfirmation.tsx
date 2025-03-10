import { Event } from "@/utils/interfaces";
import { motion } from "framer-motion";

interface TicketConfirmationProps {
  timeLeft: string;
  grandTotal: number;
  event: Event;
  cancelLockedTickets: () => void;
  selectedTickets: { [key: string]: number };
  onProceed: () => void;
}

export default function TicketConfirmation({
  timeLeft,
  grandTotal,
  event,
  selectedTickets,
  cancelLockedTickets,
  onProceed,
}: TicketConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mt-4"
    >
      <p className="text-green-400 text-lg font-semibold">Passes Confirmed!</p>
      <p>Cancel to change selections</p>

      {/* Table display of ticket summary */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-lg font-semibold mb-2">Booking Summary:</p>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Ticket Type</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {event.priceOfferings.map(({ id, name, price, capacity }) => {
              const count = selectedTickets[id] || 0;
              if (count === 0) return null;
              // Total is calculated as price * capacity * quantity
              const totalAmount = price * capacity * count;
              return (
                <tr key={id}>
                  <td className="py-2">{name}</td>
                  <td className="py-2">{count}</td>
                  <td className="py-2">₹{totalAmount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-lg font-semibold">
          Time Left: <span className="text-amber-500">{timeLeft}</span>
        </p>
      </div>
      <motion.button
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-4 flex items-center justify-center gap-2"
        onClick={onProceed}
      >
        <span>Proceed to Pay: ₹{grandTotal}</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
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
  );
}
