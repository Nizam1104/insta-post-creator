"use client"

import { useState, useEffect } from 'react';
import CanvasConfigurations from "@/components/CanvasConfigurations";
import { FaBars, FaTimes } from "react-icons/fa";
import { canvasState } from "@/services/canvasState";
import SidebarSkeleton from "@/components/Skeletons/SidebarSkeleton";

export default function CanvasLayout({ children }) {
  const [isConfigVisible, setConfigVisible] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  // Check if canvas is ready
  useEffect(() => {
    // Check if canvas is ready initially
    setIsCanvasReady(canvasState.isCanvasReady());
    
    // Set up an interval to check canvas readiness
    const checkCanvasInterval = setInterval(() => {
      if (canvasState.isCanvasReady()) {
        setIsCanvasReady(true);
        clearInterval(checkCanvasInterval);
      }
    }, 500);
    
    return () => clearInterval(checkCanvasInterval);
  }, []);

  const toggleSidebar = () => {
    setConfigVisible(!isConfigVisible);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-gray-700 p-2 rounded-md text-white hover:bg-gray-600 transition-colors"
      >
        {isConfigVisible ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      
      <div
        className={`
          fixed left-0 top-0 h-screen z-40 w-[250px] p-2 bg-gray-800
          overflow-y-auto transition-transform duration-500
          ${isConfigVisible ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {isCanvasReady ? <CanvasConfigurations /> : <SidebarSkeleton />}
      </div>
      {children}
    </div>
  );
}
