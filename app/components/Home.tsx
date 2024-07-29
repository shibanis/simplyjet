import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import '../globals.css';


// Function to split text into spans
const splitTextIntoSpans = (text: string) => {
    return text.split('').map((char, index) => (
        <span key={index}>{char}</span>
    ));
};

export default function Home() {
    const controls = useAnimation();
    const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Smooth scroll for all links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Intersection Observer for scroll-based animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const target = entry.target as HTMLDivElement;
                const index = sectionRefs.current.indexOf(target);
                if (index !== -1) {
                    if (entry.isIntersecting) {
                        controls.start({ opacity: 1, y: 0, transition: { duration: 1 } });
                    } else {
                        controls.start({ opacity: 0, y: 50 });
                    }
                }
            });
        }, { threshold: 0.2 });

        sectionRefs.current.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => {
            sectionRefs.current.forEach(section => {
                if (section) {
                    observer.unobserve(section);
                }
            });
        };
    }, [controls]);

    return (
        <div className="relative">
            {/* Animated Background Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="fixed inset-0 z-0 overflow-hidden"
            >
                <Image
                    src="/assets/private-aviation.jpg"
                    alt="Private Aviation"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                />
            </motion.div>

            {/* Transparent Header with Logo and Menu Button */}
            <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-transparent text-white z-20">
                <div className="ml-4">
                    <Image
                        src="/assets/logo.png" // Path to your logo
                        alt="Simply Jet"
                        width={120}
                        height={40}
                    />
                </div>
                <div
                    className="menu-button cursor-pointer mr-4 flex flex-col items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="text-white text-lg">MENU</span>
                    <div className="menu-lines mt-1 w-6 h-0.5 bg-white"></div>
                    <div className="menu-lines mt-1 w-6 h-0.5 bg-white"></div>
                    <div className="menu-lines mt-1 w-6 h-0.5 bg-white"></div>
                </div>
            </header>

            {/* Full Page Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-30">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full h-full flex flex-col items-center justify-center">
                        <ul className="text-center space-y-4">
                            <li>
                                <a href="#users" className="text-blue-600 text-2xl hover:underline">Users</a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Welcome Content */}
            <div id="welcome" className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center bg-black bg-opacity-50 parallax">
                <header className="p-4 text-white">
                    <div className="parallax-caption">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2, duration: 0.5 }}
                        >
                            {splitTextIntoSpans('Welcome to Simply Jet')}
                        </motion.h1>
                    </div>

                </header>

                <main className="flex flex-col items-center justify-center p-8 text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-lg mb-8 text-white"
                    >
                        We are a leading Swiss private aviation brokerage company, providing unparalleled service and innovative solutions in the private aviation industry.
                    </motion.p>
                    <a
                        href="#section1"
                        className="inline-block px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Scroll to Explore
                    </a>
                </main>
            </div>

            {/* Scrollable Sections */}
            <div className="relative">
                <motion.section
                    id="section1"
                    ref={el => sectionRefs.current[0] = el}
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-100"
                >
                    <h2 className="text-2xl mb-4">
                        Our Services
                    </h2>
                    <p className="text-lg mb-8">
                        We offer the best private jet services tailored to your needs.
                    </p>
                    <a
                        href="#section2"
                        className="inline-block px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Continue
                    </a>
                </motion.section>

                <motion.section
                    id="section2"
                    ref={el => sectionRefs.current[1] = el}
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-200"
                >
                    <h2 className="text-2xl mb-4">
                        Why Choose Us?
                    </h2>
                    <p className="text-lg mb-8">
                        Our commitment to excellence ensures that you receive the best service.
                    </p>
                    <a
                        href="#footer"
                        className="inline-block px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Finish
                    </a>
                </motion.section>

                <motion.footer
                    id="footer"
                    ref={el => sectionRefs.current[2] = el}
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    className="bg-blue-600 p-4 text-white text-center"
                >
                    <p>
                        © 2024 Simply Jet. All rights reserved.
                    </p>
                    <a
                        href="#welcome"
                        className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Back to Top
                    </a>
                </motion.footer>
            </div>
        </div>
    );
}