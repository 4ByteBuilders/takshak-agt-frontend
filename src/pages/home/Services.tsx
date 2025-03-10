import * as motion from "motion/react-client";
import type { Variants } from "motion/react";

export default function ScrollTriggered() {
    return (
        <div className="w-full bg-gradient-to-b from-transparent to-purple-400 mt-5 hidden md:block">
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="text-3xl sm:text-4xl lg:text-6xl text-center font-extrabold leading-tight drop-shadow-lg w-full"
            >
                Wait! There's more ...
            </motion.h1>
            <div className="mx-auto max-w-full w-full grid grid-cols-2">
                {food.map(([emoji, src, hueA, hueB, description], i) => (
                    <Card
                        i={i}
                        emoji={emoji}
                        img_src={src}
                        hueA={hueA}
                        hueB={hueB}
                        description={description}
                        key={emoji}
                    />
                ))}
            </div>
        </div>
    );
}

interface CardProps {
    emoji: string;
    img_src: string;
    hueA: number;
    hueB: number;
    description: string;
    i: number;
}

function Card({ emoji, img_src, hueA, hueB, description, i }: CardProps) {
    const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

    return (
        <div className="overflow-hidden py-16">
            <motion.div
                className={`card-container-${i} overflow-hidden flex justify-center items-center relative`}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ amount: 0.8 }}
            >
                <div
                    className="absolute top-0 left-0 md:left-[18%] right-0 bottom-0"
                    style={{ background, clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")` }}
                />
                <motion.div
                    className="flex flex-col p-10 font-alfa text-center text-2xl justify-start items-center rounded-[20px] bg-black/30 shadow-[0_0_1px_hsl(0deg_0%_0%_/_0.075),_0_0_2px_hsl(0deg_0%_0%_/_0.075),_0_0_4px_hsl(0deg_0%_0%_/_0.075),_0_0_8px_hsl(0deg_0%_0%_/_0.075),_0_0_16px_hsl(0deg_0%_0%_/_0.075)] origin-[10%_60%] md:w-[250px] md:h-[350px] sm:w-[200px] sm:h-[300px]"
                    variants={cardVariants}
                >
                    <img src={img_src} alt="food" className="h-1/3 w-1/3" />
                    <p className="text-xl">{emoji}</p>
                    <p className="text-[1.1rem] text-white font-poppins font-light">{description}</p>
                </motion.div>
            </motion.div>
        </div>
    );
}

const cardVariants: Variants = {
    offscreen: {
        y: 300,
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
};

const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

const food: [string, string, number, number, string][] = [
    ["Free Colors", "/holi-color.avif", 340, 10, "Splash into vibrant hues and paint the town with joy!"],
    ["DJ & EDM", "/dj-edm.avif", 20, 40, "Get ready to groove with electrifying beats all day long."],
    ["Free Welcome Soft Drinks", "/soft-drink.avif", 60, 90, "Quench your thirst with refreshing welcome drinks."],
    ["Dynamic Rain Dance", "/rain-dance.avif", 80, 120, "Dance under a thrilling rain setup with exciting music."],
    ["Bhangra", "/bhangra.avif", 260, 290, "Enjoy energetic Punjabi beats with lively Bhangra moves."],
    ["Food & Beverages", "/food.avif", 290, 320, "Delight in a variety of delicious treats and beverages."]
];