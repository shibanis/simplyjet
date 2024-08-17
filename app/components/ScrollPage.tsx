'use client';

import { useState, useRef, useEffect } from 'react';
import '../globals.css';
import { projects } from './Sections';
import Card from './Card';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Image from "next/legacy/image";
import { Parallax } from 'react-scroll-parallax';

// Function to split text into spans
const splitTextIntoSpans = (text: string) => {
    return text.split('').map((char, index) => (
        <span key={index}>{char}</span>
    ));
};

export default function ScrollPage() {
    const itemsRef = useRef<HTMLElement[]>([]);
    const observer = useRef(null);
    const container = useRef(null);
    const [showSlowHeader,setSlowHeader]=useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const body = document.body;
    useEffect(() => {
        const handleScroll = () => {
            const viewportHeight = window.innerHeight;
            const viewportMidpoint = viewportHeight / 2;
            setSlowHeader(false);

            itemsRef.current.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                const itemBottom = item.getBoundingClientRect().bottom;
                const itemCenter = (itemTop + itemBottom) / 2;
                // Change color when the item's center crosses the viewport midpoint
                if (itemCenter <= viewportMidpoint) {
                    item.style.color = '#073163'; // Blue color
                    setSlowHeader(true);
                } else {
                    item.style.color = 'grey'; // Grey color
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        // Initial check in case some items are already in view
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const menuItems = [
        { label: 'USERS', href: '/users' },
        { label: 'PORTFOLIO', href: '/users' },
        { label: 'CONTACT', href: '/users' },
        { label: 'STORIES', href: '/users' },
    ];

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    return (
        <>
            {/* Transparent Header with Logo and Menu Button */}
            <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-blue-light text-white z-20">
                <div className="ml-4">
                    <Image
                        src="/assets/logo.svg"
                        alt="Simply Jet"
                        width={120}
                        height={40}
                    />
                </div>
                {showSlowHeader && <div className='text-blue-dark'>OUR SKILLS</div>}
                <div
                    className="menu menu-button cursor-pointer mr-4 flex items-center"
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        body.classList.add('no-scroll');
                    }}
                >
                    <span className="text-blue-dark text-lg mr-4">MENU</span>
                    {!menuOpen && (
                        <div>
                            <div className="menu-lines mt-1 w-6 h-0.5 bg-blue-dark"></div>
                            <div className="menu-lines mt-1 w-6 h-0.5 bg-blue-dark"></div>
                        </div>
                    )}
                    {menuOpen && (
                        <button
                            className="top-4 right-4 text-blue-dark text-lg font-bold flex"
                            onClick={() => {
                                setMenuOpen(false);
                                body.classList.remove('no-scroll');
                            }}
                        >
                            <Image
                                src="/assets/close-icon.svg"
                                alt="Simply Jet"
                                width={24}
                                height={24}
                            />
                        </button>
                    )}
                </div>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <div className="fixed inset-0 top-[50px] bg-blue-light bg-opacity-90 flex items-center justify-center z-30">
                        <div className="relative bg-blue-light p-8 rounded-lg shadow-lg w-full h-full flex flex-col items-center overflow-scroll">
                            <ul className="text-center space-y-4 pt-[50px]">
                                {menuItems.map((item, index) => (
                                    <div key={item.label} className="menu-item-container">
                                        <motion.div
                                            initial={{ y: '100%', opacity: 0 }}
                                            animate={{ y: '0%', opacity: 1 }}
                                            exit={{ y: '-100%', opacity: 0 }}
                                            transition={{
                                                y: { duration: 0.2, delay: index * 0.1, ease: 'easeInOut' },
                                                opacity: { duration: 0.3, delay: index * 0.1, ease: 'easeInOut' },
                                            }}
                                            whileHover="hover"
                                            variants={{
                                                initial: { y: '0%' },
                                                hover: {
                                                    y: ['-100%', '-200%'],
                                                    opacity: 1,
                                                    transition: {
                                                        opacity: { duration: 0.9, ease: 'easeInOut' },
                                                        y: { duration: 0.6, ease: 'easeInOut' },
                                                    },
                                                },
                                            }}
                                            style={{ display: 'inline-block', marginTop: '30px' }}
                                        >
                                            <motion.a
                                                href={item.href}
                                                className={`text-bold text-2xl menu-item ${hoveredItem === item.label ? 'hovered' : (hoveredItem !== null ? 'not-hovered' : '')}`}
                                                onMouseEnter={() => setHoveredItem(item.label)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                {item.label}
                                                <motion.div
                                                    className="menu-item-cycle"
                                                    initial={{ y: '200%', opacity: 1 }}
                                                    whileHover={{
                                                        y: '170%',
                                                        opacity: 1,
                                                        transition: { duration: 0.6, ease: 'easeInOut' },
                                                    }}
                                                >
                                                    {item.label}
                                                </motion.div>
                                            </motion.a>
                                        </motion.div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Welcome Content */}
            <div id="welcome" className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center bg-black bg-opacity-50 parallax">
                <header className="p-4 text-white">
                    <div className="parallax-caption">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {splitTextIntoSpans('SIMPLY JET')}
                        </motion.h1>
                    </div>
                </header>
                <main className="flex flex-col items-center justify-center p-8 text-center relative">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg mb-8 blue-dark text-bold"
                    >
                        WE ARE A LEADING SWISS PRIVATE AVIATION BROKERAGE COMPANY, PROVIDING UNPARALLELED SERVICE AND INNOVATIVE SOLUTIONS IN THE PRIVATE AVIATION INDUSTRY.
                    </motion.p>
                </main>
                <a
                    href="#section1"
                    className="absolute bottom-24 left-4 inline-block px-6 py-3 text-blue-dark text-lg font-semibold transition duration-300"
                >
                    Scroll to Explore
                </a>
            </div>

            <main ref={container} className="main" id="section1">
                {projects.map((project, i) => {
                    const targetScale = 1 - (projects.length - i) * 0.1;
                    return (
                        <Card
                            key={`p_${i}`}
                            i={i}
                            {...project}
                            progress={scrollYProgress} // Pass the numeric value
                            range={[i * 0.25, 1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </main>

            <div className="slow-scroll-section h-[2800px] w-full flex items-center justify-center">
                <Parallax speed={-40}>
                    <div className="slow-item">
                        <ul>
                            {["WEB DESIGN", "MOBILE APP DEVELOPMENT", "UI/UX DESIGN", "SEO OPTIMISATION", "SOCIAL MEDIA MANAGEMENT"].map((item, index) => (
                                <li
                                    key={index}
                                    ref={el => itemsRef.current[index] = el}
                                    style={{ color: 'grey' }} // Initial color
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Parallax>
            </div>

            <div className="grid place-items-center h-[60vh] w-full">
                <h2 className="text-2xl mb-4">
                    Why Choose Us?
                </h2>
                <p className="text-lg mb-8">
                    Our commitment to excellence ensures that you receive the best service.
                </p>
            </div>

            <motion.footer
                id="footer"
                initial={{ opacity: 1, y: 50 }}
                className="bg-blue-dark p-4 text-white text-center"
            >
                <p>
                    © 2024 Simply Jet. All rights reserved.
                </p>
                <a
                    href="#welcome"
                    className="inline-block mt-4 px-6 py-3 bg-blue-dark text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-dark transition duration-300"
                >
                    Back to Top
                </a>
            </motion.footer>
        </>
    );
}
