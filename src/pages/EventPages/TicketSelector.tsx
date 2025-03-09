
interface SelectedTickets {
    [key: string]: number;
}

import { Event } from "@/utils/interfaces";

interface TicketSelectorProps {
    event: Event;
    selectedTickets: SelectedTickets;
    handleTicketChange: (type: string, value: number) => void;
}

export default function TicketSelector({ event, selectedTickets, handleTicketChange }: TicketSelectorProps) {
    return (
        <>
            {event.priceOfferings.map(({ id, name, price, capacity }: { id: string; name: string; price: number; capacity: number }) => (
                <div key={id} className="flex justify-between items-center mb-4">
                    <div className="flex flex-row items-center justify-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 shadow-xl rounded-xl px-2 py-1 md:mx-5 text-xs md:text-base font-semibold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                        <span className="text-white">{name}</span>
                        <span className="text-xs md:text-sm"> ₹{price}</span>
                        <span className="text-xs md:text-sm">{`(${capacity} ${capacity === 1 ? "person" : "people"})`}</span>
                    </div>
                    <div className="flex items-center mx-3 md:mx-5">
                        <button
                            className="px-2 text-xs md:text-sm md:px-3 py-1 bg-gray-700 rounded-l"
                            onClick={() => handleTicketChange(id, (selectedTickets[id] || 0) - 1)}
                            disabled={(selectedTickets[id] || 0) === 0}
                        >
                            -
                        </button>
                        <span className="px-2 text-xs md:text-sm md:px-4 mx-2 bg-gray-800 text-white rounded">
                            {selectedTickets[id] || 0}
                        </span>
                        <button
                            className="px-2 text-xs md:text-sm md:px-3 py-1 bg-gray-700 rounded-r"
                            onClick={() => handleTicketChange(id, (selectedTickets[id] || 0) + 1)}
                            disabled={(selectedTickets[id] || 0) === event.totalNumberOfTickets}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
