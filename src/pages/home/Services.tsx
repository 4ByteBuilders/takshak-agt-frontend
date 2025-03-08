import * as motion from "motion/react-client";
import type { Variants } from "motion/react";

export default function ScrollTriggered() {
    return (
        <>
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="text-3xl sm:text-4xl lg:text-6xl text-center font-extrabold leading-tight drop-shadow-lg border-t-2 border-b-2 w-full"
            >
                Wait! There's more ...
            </motion.h1>
            <div className="mx-auto max-w-full w-full grid grid-cols-2 backdrop-blur-md">
                {food.map(([emoji, hueA, hueB], i) => (
                    <Card i={i} emoji={emoji} hueA={hueA} hueB={hueB} key={emoji} />
                ))}
            </div>
        </>
    );
}

interface CardProps {
    emoji: string;
    hueA: number;
    hueB: number;
    i: number;
}

function Card({ emoji, hueA, hueB, i }: CardProps) {
    const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

    return (
        <div className="overlflow-hidden py-16">

            < motion.div
                className={`card-container-${i} overflow-hidden flex justify-center items-center relative`
                }
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ amount: 0.8 }}
            >
                <div className="absolute top-0 left-[18%] right-0 bottom-0" style={{ background, clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")` }} />
                <motion.div className="flex flex-col p-10 font-alfa text-2xl flex justify-start items-center rounded-[20px] bg-black/30 shadow-[0_0_1px_hsl(0deg_0%_0%_/_0.075),_0_0_2px_hsl(0deg_0%_0%_/_0.075),_0_0_4px_hsl(0deg_0%_0%_/_0.075),_0_0_8px_hsl(0deg_0%_0%_/_0.075),_0_0_16px_hsl(0deg_0%_0%_/_0.075)] origin-[10%_60%] md:w-[250px] md:h-[350px] sm:w-[200px] sm:h-[300px]" variants={cardVariants}>
                    <img src="/takshak-logo.png" alt="food" className="w-1/2" />
                    {emoji}
                    <p className="text-[1.3rem] font-semibold text-white font-sans">You will get free drinks maa.</p>
                </motion.div>
            </motion.div >
        </div >
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

/**
 * ==============   Data   ================
 */

const food: [string, number, number][] = [
    ["Free Colors", 340, 10],
    ["DJ & EDM", 20, 40],
    ["Free Welcome Soft Drinks", 60, 90],
    ["Dynamic Rain Dance", 80, 120],
    ["Bhangra", 260, 290],
    ["Food & Beverages", 290, 320]
];