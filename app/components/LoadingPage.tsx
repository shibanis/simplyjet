// LoadingPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingPageProps {
  onAnimationComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onAnimationComplete }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(2);
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, 800); // Duration of the second animation
      return () => clearTimeout(completeTimer);
    }, 800); // Duration of the first animation

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="box"
      initial={{ width: '300px', height: '20px', left: 'calc(50% - 150px)', top: '50%', position: 'absolute', zIndex: 9999 }}
      animate={step === 1 
        ? { width: '300px', left: 'calc(50% - 150px)' } // Center the growing box
        : { width: '100vw', height: '100vh', left: '0%', top: '0%' }
      }
      transition={{
        duration: 0.8,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      style={{
        background: '#c0e0f3',
        position: 'absolute',
        top: '50%',
        zIndex: 9999
      }}
    />

  );
};

export default LoadingPage;
