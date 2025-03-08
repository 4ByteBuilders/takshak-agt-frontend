import { motion } from "framer-motion";

// Define the Comment type
type Comment = {
    id: number;
    name: string;
    comment: string;
    rating: number;
};

// Sample comments data
const comments: Comment[] = [
    { id: 1, name: "John Doe", comment: "Amazing performance! Camilla Lynx killed it!", rating: 5 },
    { id: 2, name: "Jane Smith", comment: "The energy was incredible. Best night ever!", rating: 4 },
    { id: 3, name: "Alex Johnson", comment: "Camilla Lynx knows how to keep the crowd moving!", rating: 5 },
    { id: 4, name: "Sarah Lee", comment: "Absolutely mind-blowing set!", rating: 5 },
    { id: 5, name: "Mike Brown", comment: "The vibes were unmatched!", rating: 4 },
];

import { Star } from "lucide-react"; // Using Lucide icons for consistent design

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-4 w-4 ${index < rating ? "text-yellow-600/80" : "text-gray-500"}`}
                    fill={index < rating ? "currentColor" : "none"} // Filled stars for rating
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
};

const ParallaxComments = () => {
    const duplicatedComments = [...comments, ...comments, ...comments, ...comments, ...comments];
    const reverseComments = duplicatedComments.reverse();
    return (
        <div className="relative w-full overflow-hidden ">
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-white max-w-4xl p-5"
                >
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg"
                    >
                        From Camilla's Feed
                    </motion.h1>

                    <div className="grid grid-cols-2 gap-4 overflow-hidden h-[400px] mt-5">
                        <motion.div
                            className="flex flex-col gap-4"
                            animate={{
                                y: ["0%", "-100%"],
                            }}
                            transition={{
                                ease: "linear",
                                duration: 100,  // Adjust for desired speed
                                repeat: Infinity,
                            }}
                        >
                            {/* Repeat content twice for infinite effect */}
                            {duplicatedComments.map((comment, index) => (
                                <motion.div
                                    key={`${comment.id}-${index}`}
                                    className="bg-black/30 border-0 p-4 rounded-xl shadow-md"
                                >
                                    <h3 className="text-lg font-bold">{comment.name}</h3>
                                    <StarRating rating={comment.rating} />
                                    <p className="text-sm mt-2">{comment.comment}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div
                            className="flex flex-col gap-4"
                            animate={{
                                y: ["-90%", "0%"],
                            }}
                            transition={{
                                ease: "linear",
                                duration: 100,  // Adjust for desired speed
                                repeat: Infinity,
                            }}
                        >
                            {/* Repeat content twice for infinite effect */}
                            {reverseComments.map((comment, index) => (
                                <motion.div
                                    key={`${comment.id}-${index}`}
                                    className="bg-black/30 border-0 p-4 rounded-xl shadow-md"
                                >
                                    <h3 className="text-lg font-bold">{comment.name}</h3>
                                    <StarRating rating={comment.rating} />
                                    <p className="text-sm mt-2">{comment.comment}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParallaxComments;
