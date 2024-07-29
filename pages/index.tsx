// App.tsx
import React, { useState } from 'react';
import LoadingPage from '../app/components/LoadingPage';
import Home from '../app/components/Home';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {!isLoaded ? (
        <LoadingPage onAnimationComplete={() => setIsLoaded(true)} />
      ) : (
        <Home />
      )}
    </div>
  );
};

export default App;
