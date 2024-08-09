import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import  '../globals.css';

const GlobalCursor: React.FC = () => {
  const cursor = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isCard, setIsCard] = useState<boolean>(false);

  const scale = {
    x: useMotionValue(1),
    y: useMotionValue(1),
  };

  const manageMouseMove = (e: MouseEvent) => {
    if (cursor.current) {
      const { clientX, clientY } = e;
      const cursorSize = isCard ? 40 : 20; // Double size when over card
      cursor.current.style.left = `${clientX - cursorSize / 2}px`;
      cursor.current.style.top = `${clientY - cursorSize / 2}px`;

      if (!isSticky) {
        // Scale effect when hovering
        if (isHovered) {
          const { width, height } = cursor.current.getBoundingClientRect();
          const distance = { x: clientX - (clientX - width / 2), y: clientY - (clientY - height / 2) };
          const absDistance = Math.max(Math.abs(distance.x), Math.abs(distance.y));
          const newScaleX = Math.min(1.3, Math.max(1, absDistance / 100));
          const newScaleY = Math.min(1.3, Math.max(1, absDistance / 100));
          scale.x.set(newScaleX);
          scale.y.set(newScaleY);
        } else {
          // Reset scale
          scale.x.set(1);
          scale.y.set(1);
        }
      }
    }
  };

  const manageMouseEnter = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.closest('.card')) {
        setIsCard(true);
      } else {
        setIsCard(false);
      }

      if (e.target.closest('.menu')) {
        setIsSticky(true);
        setIsHovered(true);
      } else {
        setIsSticky(false);
        setIsHovered(false);
      }
    }
  };

  const manageMouseLeave = () => {
    setIsHovered(false);
    setIsCard(false);
    setIsSticky(false);
    if (cursor.current) {
      animate(cursor.current, { scaleX: 1, scaleY: 1 }, { duration: 0.1, type: "spring" });
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", manageMouseMove);
    document.addEventListener("mouseenter", manageMouseEnter, true); // Use capturing phase
    document.addEventListener("mouseleave", manageMouseLeave, true); // Use capturing phase

    return () => {
      document.removeEventListener("mousemove", manageMouseMove);
      document.removeEventListener("mouseenter", manageMouseEnter, true);
      document.removeEventListener("mouseleave", manageMouseLeave, true);
    };
  }, [isHovered, isSticky]);

  return (
    <div className="cursorContainer">
      <motion.div 
        ref={cursor}
        className={`cursor ${isHovered ? "hovered" : ''} ${isCard ? "card" : ''} ${isSticky ? "sticky" : ''}`}
        style={{
          scaleX: scale.x,
          scaleY: scale.y
        }}
      >
        {isCard && <span className={"text"}>[OPEN]</span>}
      </motion.div>
    </div>
  );
};

export default GlobalCursor;
