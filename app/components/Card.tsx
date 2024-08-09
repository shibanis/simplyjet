'use client';

import { useRef, useEffect, useState } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
    progress: any;
    range: [number, number];
    targetScale: number;
}

const Card: React.FC<CardProps> = ({ title, description, src, link, color, i, progress, range, targetScale }) => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [blurValue, setBlurValue] = useState(0);

    // Scale based on progress
    const scale = useTransform(progress, range, [1, targetScale]);

    const { scrollYProgress } = useScroll({
        target: containerRef, // Pass the ref directly
        offset: ['start end', 'start start'],
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

    // Calculate blur value based on scrollYProgress
    useEffect(() => {
        const unsubscribe = scale.onChange(v => {
            console.log('Scroll Progress for card:', v); // Debugging line
            if (i !== 2) {
                // Adjust the blur amount based on how much of the card is out of view
                if (v > 0.96) {
                    const blur = (1 - v) * 50; // Blur increases as the card scrolls out of view
                    setBlurValue(blur);
                }
            }

        });

        return () => {
            unsubscribe();
        };
    }, [scale]);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    return (
        <div className="cardContainer" ref={containerRef} onClick={() => router.push(link)}>
            <motion.div
                style={{
                    filter: `blur(${blurValue}px)`, // Apply dynamic blur effect
                    backgroundColor: color,
                    scale,
                    top: `calc(-5vh + ${i+1 * 30}px)`
                }}
                className="card"
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
                                alt={title}
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
