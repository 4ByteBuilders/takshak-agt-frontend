import { motion } from "framer-motion";
import Lottie from "lottie-react";
import scrolldown from "@/assets/scroll_down.json";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { Event } from "@/utils/interfaces";

interface EventHeaderProps {
  event: Event;
  scrollY: number;
}

export default function EventHeader({ event, scrollY }: EventHeaderProps) {
  const backgroundStyle = {
    backgroundColor: `rgba(3, 7, 18, ${Math.max(scrollY / 300, 0.3)})`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      <div
        className="md:hidden w-full h-screen bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url(/mobile-eventView.avif)",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
        }}
      />
      <div
        className="hidden md:block w-full h-screen bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url(/laptop-eventView.avif)",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
        }}
      />
      <div
        className="absolute inset-0 flex flex-row text-start"
        style={backgroundStyle}
      >
        <div className="flex flex-col justify-end text-start p-2 md:p-10">
          <h1 className="w-full text-7xl font-bold transition-transform duration-300">
            {event.title}
          </h1>
          <p className="text-lg md:text-xl text-pretty font-sans text-stone-300 font-semibold transition-transform duration-300">
            {formatDate(event.dateTime, "DD MMMM YYYY")} |{" "}
            {formatTime(event.dateTime, "hh:mm A")} | {event.venue}
          </p>
        </div>
        <div className="flex items-end pb-16 md:pb-0">
          <Lottie
            animationData={scrolldown}
            style={
              scrollY > 0 ? { width: 50, height: 0 } : { width: 50, height: 50 }
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
