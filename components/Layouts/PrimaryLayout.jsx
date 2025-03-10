"use client"
import { useState, useEffect } from "react";
import CanvasConfigurations from "../CanvasConfigurations";
import CreateCodeScreenShot from "../Modals/CreateCodeScreenShot";
import { useRouter } from "next/navigation";
import { canvasState } from "../../services/canvasState";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";

export default function PrimaryLayout({ children }) {
  const router = useRouter();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
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
  
  function gotoCanvas() {
    router.push('/canvas')
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-gray-800 shadow-sm z-50 px-6 flex items-center">
        <h1 className="text-xl font-semibold text-white">Drawvinci</h1>
      </header>

      {/* Main Content with Three Columns */}
      <div className="pt-[60px] h-[calc(100vh-0px)]">
        {/* Offset for fixed header and full height */}
        <div className="px-6 h-full">
          <div className="flex gap-6 py-6 h-full">
            {/* Left Column */}
            <div className="w-[30%] bg-gray-800 rounded-lg shadow-sm p-4 h-full overflow-y-auto">
              {isCanvasReady ? <CanvasConfigurations /> : <SidebarSkeleton />}
            </div>

            {/* Middle Column */}
            <div className="w-[50%] bg-gray-800 rounded-lg shadow-sm p-4 h-full overflow-y-auto">
              <main className="text-white h-full">{children}</main>
            </div>

            {/* Right Column */}
            <div className="w-[20%] bg-gray-800 rounded-lg shadow-sm p-4 h-full">
              <h1 className="text-base font-semibold text-gray-300">
                Other utilities
              </h1>
              <div className="flex flex-col justify-center items-start space-y-2">
              <div className="mt-2">
                  <CreateCodeScreenShot />
                </div>
                <div>
                  <button onClick={gotoCanvas} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300 px-2 py-1 rounded-md">
                    Full canvas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
