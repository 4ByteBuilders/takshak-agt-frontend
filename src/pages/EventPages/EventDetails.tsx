
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Event } from "@/utils/interfaces";

interface EventDetailsProps {
    event: Event;
    availableTickets: number;
    showLockLoader: boolean;
    onRefresh: () => void;
}

export default function EventDetails({ event, availableTickets, showLockLoader, onRefresh }: EventDetailsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="rounded-lg shadow-lg text-center"
        >
            <p className="text-lg md:text-xl px-4">{event.description}</p>
            <div className="flex items-center justify-center">
                <p className="text-lg md:text-xl text-amber-300">{availableTickets} passes left</p>
                <Button variant={"link"} className="text-amber-300 font-bold" onClick={onRefresh}>
                    <RefreshCw className={`w-5 h-5 ${showLockLoader ? "animate-spin" : ""}`} />
                </Button>
            </div>
        </motion.div>
    );
}
