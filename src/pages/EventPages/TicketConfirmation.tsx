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
  event,
  selectedTickets,
  cancelLockedTickets,
  onProceed,
}: TicketConfirmationProps) {
  // Build an array for each ticket row
  const ticketRows = event.priceOfferings.reduce((acc, { id, name, price }) => {
    const count = selectedTickets[id] || 0;
    if (count > 0) {
      const totalAmount = price * count;
      acc.push({ id, name, count, totalAmount });
    }
    return acc;
  }, [] as { id: string; name: string; count: number; totalAmount: number }[]);

  // Calculate totals for all tickets
  const totalTicketAmount = ticketRows.reduce(
    (sum, row) => sum + row.totalAmount,
    0
  );
  const platformFee = totalTicketAmount * 0.023;
  const finalGrandTotal = totalTicketAmount + platformFee;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mt-4"
    >
      <p className="text-green-400 text-lg font-semibold">Passes Confirmed!</p>
      <p>Cancel to change selections</p>

      {/* Modified table display of ticket summary */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <table className="w-full">
          <tbody>
            {ticketRows.map((row) => (
              <tr key={row.id} className="border-b border-gray-600">
                <td className="py-2 flex justify-between">
                  <span>
                    {row.name} x {row.count}
                  </span>
                  <span className="text-right">₹{row.totalAmount}</span>
                </td>
              </tr>
            ))}
            {/* Platform fees row */}
            <tr className="border-b border-gray-600">
              <td className="py-2 flex justify-between gap-8 font-medium">
                <span>Platform Fees (2.3%)</span>
                <span className="text-right">₹{platformFee.toFixed(2)}</span>
              </td>
            </tr>
            {/* Grand Total row */}
            <tr>
              <td className="py-2 flex justify-between font-bold">
                <span>Grand Total</span>
                <span className="text-right">
                  ₹{finalGrandTotal.toFixed(2)}
                </span>
              </td>
            </tr>
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
        <span>Proceed to Pay: ₹{finalGrandTotal.toFixed(2)} </span>
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
