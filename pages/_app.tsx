// pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../app/globals.css'; // Adjust if necessary
import AnimatedCursor from "react-animated-cursor"

// Create a QueryClient instance
const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AnimatedCursor
                innerSize={8}
                outerSize={35}
                innerScale={1}
                outerScale={2}
                outerAlpha={0}
                innerStyle={{
                    backgroundColor: 'var(--inner-cursor-color)',
                }}
                outerStyle={{
                    border: '3px solid var(--cursor-color)',
                }}
            />
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;
