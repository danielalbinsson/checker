import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Log to check when the client side is ready
    console.log("Checking client-side execution...");
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      console.log("Client-side detected. Attempting to read localStorage.");
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);

      if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
        router.push('/login');
      } else {
        setLoading(false);
      }
    }
  }, [isClient, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
