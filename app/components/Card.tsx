'use client';

import { useRef, useEffect } from 'react';
import { useTransform, useScroll, motion, useMotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Use `next/navigation` instead of `next/router` for Next.js 13+
import Image from 'next/image';
import '../globals.css';
import Lenis from '@studio-freight/lenis';

interface CardProps {
    title: string;
    description: string;
    src: string;
    link: string;
    color: string;
    i: number;
    progress: any; // Pass this as a number
    range: [number, number];
    targetScale: number; // Pass this as a number
}

const Card: React.FC<CardProps> = ({ title, description, src, link, color, i, progress, range, targetScale }) => {
    const router = useRouter();
    const container = useRef<HTMLDivElement>(null); // Ensure it's not null initially
    
    // Convert progress to MotionValue
    // const progressMotionValue = useMotionValue(progress);
    const scale = useTransform(progress, range, [1, targetScale]);

    // useScroll can be conditionally applied or safely checked
    const { scrollYProgress } = useScroll({
        target: container, // Pass the ref directly
        offset: ['start end', 'start start'],
    });
    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    });

    return (
        <div className="cardContainer" onClick={() => router.push(link)}>
            <motion.div
                style={{ backgroundColor: color, scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="card"
                // ref={container} // Attach ref to the container
            >
                <div className="body">
                    <div className="imageContainer">
                        <motion.div
                            className="inner"
                            style={{ scale: imageScale }}
                        >
                            <Image
                                fill
                                src={`/assets/${src}`}
                                alt="title"
                            />
                        </motion.div>
                        <div className="description">
                            <h1 className="title">{title}</h1>
                            <p>{description}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Card;
