import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const targetDate = new Date("2025-03-14T00:00:00.000Z").getTime();

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

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

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg')" }}>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Blurred Background for a dreamy effect */}
            <div className="absolute inset-0 backdrop-blur-md"></div>

            {/* Content Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="relative z-10 text-center text-white max-w-4xl p-5"
            >
                {/* Animated Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg"
                >
                    Get Ready to Witness the <br />
                    <span className="text-amber-400">Grandeur of Agartala!</span>
                </motion.h1>

                {/* Event Name */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-lg sm:text-xl md:text-2xl font-light mt-4"
                >
                    Rang Barse 2.0 🌈🎉
                </motion.p>

                {/* Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-8 flex justify-center gap-2 sm:gap-3 bg-white/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg backdrop-blur-md"
                >
                    <span className="text-amber-400">{timeLeft.days}</span>d :
                    <span className="text-green-400">{timeLeft.hours}</span>h :
                    <span className="text-blue-400">{timeLeft.minutes}</span>m :
                    <span className="text-red-400">{timeLeft.seconds}</span>s
                </motion.div>

                {/* Call-to-Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="mt-6 sm:mt-8"
                >
                    <button onClick={() => navigate('/view/event')} className="relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full text-sm sm:text-base md:text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                        Book Your Tickets Now →
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}