import {  useState } from "react";
import { motion } from "motion/react";
import { formatDate } from "@/utils/dateFormatter";

interface Event {
    title: string;
    dateTime: string;
    venue: string;
    description: string;
    totalNumberOfTickets: number;
    priceOfferings: { name: string; price: string; capacity: string }[];
    eventImgUrl : string;
}

export default function EventPagePreview({ event }: { event: Event }) {
    const [ticketsLocked, setTicketsLocked] = useState(false);

    const toggleLock = () => {
        setTicketsLocked((prev) => !prev);
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
                    src={event.eventImgUrl}
                    alt="Event"
                    className="w-full h-96 sticky top-0 left-0 object-cover rounded-lg shadow-lg z-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end text-start rounded-lg z-10">
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
                {event.priceOfferings.map(({name, price, capacity }) => (
                    <div className="flex justify-between items-center mb-4">
                        <div
                            className={
                                !ticketsLocked
                                    ? "flex flex-row items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 shadow-xl rounded-xl px-2 py-1 mx-5 text-sm font-semibold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                                    : "flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                            }
                        >
                            <span className="text-white">{name}</span>
                            <span className="text-xs font-bold"> ₹{price}</span>
                            <span className="text-xs font-bold"> {capacity} persons</span>
                        </div>
                        <div className="flex items-center mx-5">
                            <button
                                className="px-3 py-1 bg-gray-700 rounded-l"
                            >
                                -
                            </button>
                            <span className="px-4">0</span>
                            <button
                                className="px-3 py-1 bg-gray-700 rounded-r"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}

                {/* Lock Tickets Button */}
                {!ticketsLocked ? (
                    <button
                        onClick={toggleLock}
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
                            <p className="text-lg font-semibold">Time Left: <span className="text-amber-500">13m 25s</span></p>
                        </div>
                        <button
                            onClick={toggleLock}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
                        >
                            Proceed to Payment →
                        </button>
                    </motion.div>
                )}
            </motion.div>

        </div>
    );
}
