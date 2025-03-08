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
    { id: 1, name: "jay__1304", comment: "I was there, it was such a vibe. Props to stepfun and camilla 🙌", rating: 5 },
    { id: 2, name: "itsankitadey", comment: "Come to Guwahati please ❤🔥", rating: 4 },
    { id: 3, name: "avenezuelandreamer", comment: "All what I need in life 😍", rating: 5 },
    { id: 4, name: "meakinmusic", comment: "Beautiful track🙌🏼💫", rating: 5 },
    { id: 5, name: "the_unkown_escapist", comment: "Bangerrr! 🙌🏼❤🔥", rating: 5 },
    { id: 6, name: "juliablissmusicacademy", comment: "Exquisite", rating: 5 },
    { id: 7, name: "jay__1304", comment: "I was there, it was such a vibe. Props to stepfun and camilla 🙌", rating: 5 },
    { id: 8, name: "itsankitadey", comment: "Come to Guwahati please ❤🔥", rating: 4 },
    { id: 9, name: "avenezuelandreamer", comment: "All what I need in life 😍", rating: 5 },
    { id: 10, name: "meakinmusic", comment: "Beautiful track🙌🏼💫", rating: 5 },
    { id: 11, name: "the_unkown_escapist", comment: "Bangerrr! 🙌🏼❤🔥", rating: 5 },
    { id: 12, name: "juliablissmusicacademy", comment: "Exquisite", rating: 5 },
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
                        className="text-2xl md:text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg"
                    >
                        Straight from the Fans
                    </motion.h1>

                    <div className="grid grid-cols-2 gap-4 overflow-hidden h-[400px] mt-5">
                        <motion.div
                            className="flex flex-col gap-4"
                            animate={{
                                y: ["0%", "-100%"],
                            }}
                            transition={{
                                ease: "linear",
                                duration: 200,  // Adjust for desired speed
                                repeat: Infinity,
                            }}
                        >
                            {/* Repeat content twice for infinite effect */}
                            {duplicatedComments.map((comment, index) => (
                                <motion.div
                                    key={`${comment.id}-${index}`}
                                    className="bg-black/30 border-0 p-4 rounded-xl shadow-md"
                                >
                                    <h3 className="text-sm md:text-lg font-semibold md:font-bold truncate">{comment.name}</h3>
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
                                duration: 200,  // Adjust for desired speed
                                repeat: Infinity,
                            }}
                        >
                            {/* Repeat content twice for infinite effect */}
                            {reverseComments.map((comment, index) => (
                                <motion.div
                                    key={`${comment.id}-${index}`}
                                    className="bg-black/30 border-0 p-4 rounded-xl shadow-md"
                                >
                                    <h3 className="text-sm md:text-lg font-semibold md:font-bold truncate">{comment.name}</h3>
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
