// App.tsx
import React, { useState } from 'react';
import LoadingPage from '../app/components/LoadingPage';
import ScrollPage from '../app/components/ScrollPage';
import { ParallaxProvider } from 'react-scroll-parallax';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {!isLoaded ? (
        <LoadingPage onAnimationComplete={() => setIsLoaded(true)} />
      ) : (
        <ParallaxProvider><ScrollPage /></ParallaxProvider>

      )}
    </div>
  );
};

export default App;
