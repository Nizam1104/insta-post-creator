"use client"

import { useState, useEffect } from 'react';
import CanvasConfigurations from "@/components/CanvasConfigurations";
import FullScreenLayout from "@/components/Layouts/FullScreen";

export default function CanvasLayout({ children }) {
  const [isConfigVisible, setConfigVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Add global mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX <= 100) {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }
        setConfigVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setConfigVisible(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  return (
    <FullScreenLayout>
      <div 
        className={`
          fixed left-0 top-0 h-screen z-40 w-[400px] p-2 bg-gray-800
          overflow-y-auto transition-transform duration-500
          ${isConfigVisible ? 'translate-x-0' : '-translate-x-full'}
        `}
        onMouseLeave={handleMouseLeave}
      >
        <CanvasConfigurations />
      </div>
      {children}
    </FullScreenLayout>
  );
}
