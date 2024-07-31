'use client';

import { useState, useRef } from 'react';
import '../globals.css';
import { projects } from './Sections';
import Card from './Card';
import { motion, useScroll, useAnimation, AnimatePresence } from 'framer-motion';
import Image from "next/legacy/image";


// Function to split text into spans
const splitTextIntoSpans = (text: string) => {
    return text.split('').map((char, index) => (
        <span key={index}>{char}</span>
    ));
};

export default function ScrollPage() {
    const container = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const menuItems = [
        { label: 'Users', href: '/users' },
        // Add more items as needed
    ];
    const { scrollYProgress } = useScroll({

        target: container,

        offset: ['start start', 'end end']

    })
    return (
        <>
            {/* Transparent Header with Logo and Menu Button */}
            <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-blue-light text-white z-20">
                <div className="ml-4">
                    <Image
                        src="/assets/logo.svg" // Path to your logo
                        alt="Simply Jet"
                        width={120}
                        height={40}
                    />
                </div>
                <div
                    className="menu-button cursor-pointer mr-4 flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="text-blue-dark text-lg mr-4">
                        <motion.div
                            whileHover="hover"
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            style={{ display: 'inline-block' }}
                        >
                            MENU
                        </motion.div></span>
                    <div>
                        <div className="menu-lines mt-1 w-6 h-0.5 bg-blue-dark"></div>
                        <div className="menu-lines mt-1 w-6 h-0.5 bg-blue-dark"></div>
                        <div className="menu-lines mt-1 w-6 h-0.5 bg-blue-dark"></div>
                    </div>
                </div>
            </header>
            {/* Full Page Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-blue-light bg-opacity-90 flex items-center justify-center z-30">
                    <div className="relative bg-blue-light p-8 rounded-lg shadow-lg w-full h-full flex flex-col items-center justify-center">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-blue-dark text-lg font-bold"
                            onClick={() => setMenuOpen(false)}
                        >
                            Close
                        </button>
                        <ul className="text-center space-y-4">
                            <AnimatePresence>
                                {menuItems.map((item) => (
                                    <div style={{ height: '8em' }}>
                                        <motion.div
                                            initial={{ y: '100%' }}
                                            animate={{ y: '0%' }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <a
                                                href={item.href}
                                                className="text-blue-dark text-bold text-2xl hover:underline menu-item"
                                                onClick={() => setSelectedItem(item.label)}
                                            >
                                                {item.label}
                                            </a>
                                        </motion.div>
                                    </div>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>
            )}
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
                        WE ARE A LEADING SWISS PRIVATE AVIATION BROKERAGE COMPANY,PROVIDING UNPARALLELED SERVICE AND INNVOATIVE SOLUTIONS IN THE PRIVATE AVIATION INDUSTRY.
                    </motion.p>
                    <a
                        href="#section1"
                        className="absolute top-48 left-4 inline-block px-6 py-3 text-blue-dark text-lg font-semibold transition duration-300"
                    >
                        Scroll to Explore
                    </a>
                </main>
            </div>
            <main ref={container} className="main" id="section1">

                {

                    projects.map((project, i) => {

                        const targetScale = 1 - ((projects.length - i) * 0.1);

                        return <Card key={`p_${i}`} i={i} {...project} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale} />

                    })

                }

            </main>
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


    )

}