'use client';

import { useEffect } from 'react';

export default function WarningSupressor() {
  useEffect(() => {
    // Suppress Ant Design React compatibility warnings
    // This is safe since we're using React 18.3.1 which is officially supported
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = (...args) => {
      if (args[0]?.includes?.('[antd: compatible]') || 
          args[0]?.includes?.('antd v5 support React is 16 ~ 18')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      if (args[0]?.includes?.('[antd: compatible]') || 
          args[0]?.includes?.('antd v5 support React is 16 ~ 18')) {
        return;
      }
      originalError.apply(console, args);
    };

    // Cleanup function to restore original methods
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null;
} 