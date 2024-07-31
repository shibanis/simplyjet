'use client'
import { useRef, useEffect } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../globals.css';
import Lenis from '@studio-freight/lenis'


const Card = ({ title, description, src, link, color, i, progress, range, targetScale }) => {
    const router = useRouter();
    const container = useRef(null);
    const scale = useTransform(progress, range, [1, targetScale]);
    const { scrollYProgress } = useScroll({

        target: container,

        offset: ['start end', 'start start']

    })
    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])

    useEffect(() => {
        const lenis = new Lenis()
        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

    })
    return (
        <div className="cardContainer" onClick={() => { router.push(link) }}>
            <motion.div
                style={{ backgroundColor: color, scale, top: `calc(-5vh + ${i * 25}px)` }}
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
                                alt="image"
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
    )
}

export default Card