import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { useRef } from "react";
import "./styles.css";
import CommentsSection from "./Comments";
import Lottie from "lottie-react";
interface ParallaxProps {
    children: string;
    baseVelocity: number;
}

import SpinningDisk from "@/assets/SpinningDisk.json";

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        if (scrollVelocity.get() !== 0) {
            baseX.set(baseX.get() + moveBy);
        }
    });

    return (
        <div className="parallax">
            <motion.div className="scroller" style={{ x }}>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
            </motion.div>
        </div>
    );
}

const DjLineup = () => {
    return (
        <div className="djlineup min-h-screen w-full backdrop-blur-sm overflow-hidden">
            <link rel="stylesheet" href="style.css" />
            <ParallaxText baseVelocity={5}>DJ in the house</ParallaxText>
            <div className="h-2" />
            <ParallaxText baseVelocity={-5}>Camilla Lynx</ParallaxText>
            <div className="relative flex flex-col md:flex md:flex-row md:gap-4 md:items-center md:justify-center">
                <Lottie animationData={SpinningDisk}
                    className="z-0 hidden md:block absolute inset-0 mx-auto transform -translate-x-1/4 translate-y-4" />
                <img src="/camilla.png" alt="djlineup" className="object-cover z-10 md:w-1/2" />
                <CommentsSection />
            </div>
        </div>
    );
};

export default DjLineup;