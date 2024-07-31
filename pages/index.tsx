// App.tsx
import React, { useState } from 'react';
import LoadingPage from '../app/components/LoadingPage';
import Home from '../app/components/Home';
import ScrollPage from '../app/components/ScrollPage';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {!isLoaded ? (
        <LoadingPage onAnimationComplete={() => setIsLoaded(true)} />
      ) : (
        <ScrollPage />
      )}
    </div>
  );
};

export default App;
