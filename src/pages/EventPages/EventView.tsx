"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
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

export default function EventView() {
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
        availability: { total: 500, available: 100 },
    };

    const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
    const [ticketsLocked, setTicketsLocked] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    // Handle Ticket Selection
    const handleTicketChange = (type: string, value: number) => {
        setSelectedTickets((prev) => ({
            ...prev,
            [type]: Math.max(0, value), // Prevent negative values
        }));
    };

    // Lock Tickets
    const lockTickets = () => {
        if (Object.values(selectedTickets).some((qty) => qty > 0)) {
            setTicketsLocked(true);
        } else {
            setShowDialog(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-6">
            {/* Event Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-4xl"
            >
                <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-center p-4 rounded-lg">
                    <h1 className="text-4xl font-bold">{event.name}</h1>
                    <p className="text-lg">{event.date} | {event.place}</p>
                </div>
            </motion.div>

            {/* Event Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-3xl mt-6 p-6 bg-gray-800 rounded-lg shadow-lg text-center"
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
                className="max-w-3xl mt-6 p-6 bg-gray-800 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Select Your Tickets</h2>
                {event.priceOfferings.map(({ type, price }) => (
                    <div key={type} className="flex justify-between items-center mb-4">
                        <span className="text-lg">{type} - ₹{price}</span>
                        <div className="flex items-center">
                            <button
                                className="px-3 py-1 bg-gray-700 rounded-l"
                                onClick={() =>
                                    handleTicketChange(type, (selectedTickets[type] || 0) - 1)
                                }
                                disabled={(selectedTickets[type] || 0) === 0}
                            >
                                -
                            </button>
                            <span className="px-4">{selectedTickets[type] || 0}</span>
                            <button
                                className="px-3 py-1 bg-gray-700 rounded-r"
                                onClick={() =>
                                    handleTicketChange(type, (selectedTickets[type] || 0) + 1)
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
                        <p className="text-green-400 text-lg font-semibold">Tickets Locked!</p>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all mt-4">
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
                        <AlertDialogDescription>Please select at least one ticket.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
