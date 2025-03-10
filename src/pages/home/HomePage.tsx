import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../lib/Providers/EventProvider";
import { Skeleton } from "@/components/ui/skeleton";
import DjLineup from "./Djlineup";
import Services from "./Services";
import ServicesSmall from "./ServicesSmall";
import Lottie from "lottie-react";
import scrolldown from "@/assets/scroll_down.json";
import { LucideCalendar, LucideMapPin } from "lucide-react";
export default function HomePage() {
  const navigate = useNavigate();
  const { event } = useEvent(); // Get event data from the provider
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date().getTime();
    const difference = new Date(targetDate).getTime() - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };
  // useEffect(() => {
  //   if(user)
  //   toast("Logged in successfully");
  // }, []);
  useEffect(() => {
    if (event?.dateTime) {
      setTimeLeft(calculateTimeLeft(new Date(event.dateTime)));

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(new Date(event.dateTime)));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event]);

  const loading = !event;

  return (
    <>
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-fixed pt-0 md:pt-14"
        style={{
          backgroundImage: 'url("/bgl.avif")',
        }}
      >
        <div className="h-screen w-full flex flex-col items-center justify-center">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          {/* Blurred Background */}
          {/* <div className="absolute inset-0 backdrop-blur-sm"></div> */}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 text-center text-white max-w-4xl p-5"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg"
            >
              Takshak Presents
            </motion.h1>

            {/* Event Name */}
            {loading ? (
              <Skeleton className="w-48 h-6 mt-4 mx-auto" />
            ) : (
              <div>
                <motion.img
                  src="/rangbarselogo2.avif"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="w-1/2 mx-auto my-5"
                ></motion.img>
                <div className="flex flex-col md:flex-row items-center justify-center mt-4">
                  <div className="flex">
                    <LucideMapPin
                      name="map-pin"
                      className="w-5 h-5 mr-2 text-white"
                    />
                    <p className="font-semibold text-md text-white px-2">
                      Pragati Playground, Krishnanagar{" "}
                      <span className="hidden md:inline"> | </span>{" "}
                    </p>
                  </div>
                  <div className="flex">
                    <LucideCalendar
                      name="calendar"
                      className="w-5 h-5 mr-2 text-white"
                    />
                    <p className="font-semibold text-md text-white">
                      15 March, 2025 | 10 AM Onwards
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Countdown Timer */}
            {loading ? (
              <div className="flex gap-3 justify-center mt-8">
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-12 h-12 rounded-md" />
              </div>
            ) : (
              timeLeft && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-4 flex justify-center gap-2 sm:gap-3 bg-white/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg backdrop-blur-md"
                >
                  <span className="text-amber-400">{timeLeft.days}</span>d :
                  <span className="text-green-400">{timeLeft.hours}</span>h :
                  <span className="text-blue-400">{timeLeft.minutes}</span>m :
                  <span className="text-red-400">{timeLeft.seconds}</span>s
                </motion.div>
              )
            )}

            {/* Call-to-Action Button */}
            {loading ? (
              <Skeleton className="w-48 h-12 mt-6 mx-auto rounded-full" />
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="mt-6 sm:mt-8"
                >
                  <button
                    onClick={() => navigate("/view-event")}
                    className="relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full text-sm sm:text-base md:text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Grab Your Passes Now →
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
          <div>
            <Lottie
              animationData={scrolldown}
              style={
                scrollY > 0
                  ? { width: 0, height: 50 }
                  : { width: 50, height: 50 }
              }
            />
          </div>
        </div>
        <DjLineup />
        <ServicesSmall />
        <Services />
      </div>
    </>
  );
}
