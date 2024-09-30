import { useEffect } from 'react';

const TestLocalStorage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // We're on the client-side
      console.log('LocalStorage value:', localStorage.getItem('testKey'));

      // Set a value to localStorage
      localStorage.setItem('testKey', 'This is a test');
      console.log('After setting, LocalStorage value:', localStorage.getItem('testKey'));
    }
  }, []);

  return <div>Check the console for localStorage values.</div>;
};

export default TestLocalStorage;
