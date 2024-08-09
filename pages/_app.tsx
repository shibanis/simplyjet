// pages/_app.tsx
import React,{useRef} from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../app/globals.css'; // Adjust if necessary
import GlobalCursor from '@/app/components/GlobalCursor';

// Create a QueryClient instance
/**
 * A QueryClient instance is created, which will be used to manage caching, synchronization, and server state for your application.
 */
const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const stickyElement = useRef<HTMLDivElement | null>(null);
    return (
        <QueryClientProvider client={queryClient}>
                 <GlobalCursor />
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;
