"use client"

import { zIndexService } from '@/services/zIndexService';
import { Button } from '../ui/button';
import { FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function SetElementZIndex() {
  const [hoveredButton, setHoveredButton] = useState("");
  const [showTooltip, setShowTooltip] = useState("");

  const handleBringToFront = () => {
    zIndexService.bringToFront();
  };

  const handleBringForward = () => {
    zIndexService.bringForward();
  };

  const handleSendBackward = () => {
    zIndexService.sendBackward();
  };

  const handleSendToBack = () => {
    zIndexService.sendToBack();
  };

  return (
    <div className="flex flex-col space-y-2 bg-gray-900 p-2 rounded-md">
      <Button 
        onClick={handleBringToFront}
        className="w-full flex items-center justify-between"
        onMouseEnter={() => setHoveredButton('bringToFront')}
        onMouseLeave={() => setHoveredButton('')}
      >
        Max Z-Index
        {hoveredButton === 'bringToFront' && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip('bringToFront')}
            onMouseLeave={() => setShowTooltip('')}
          >
            <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
            {showTooltip === 'bringToFront' && (
              <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                Maximum stack index
              </div>
            )}
          </div>
        )}
      </Button>
      <Button 
        onClick={handleBringForward}
        className="w-full flex items-center justify-between"
        onMouseEnter={() => setHoveredButton('bringForward')}
        onMouseLeave={() => setHoveredButton('')}
      >
        Z-Index++
        {hoveredButton === 'bringForward' && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip('bringForward')}
            onMouseLeave={() => setShowTooltip('')}
          >
            <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
            {showTooltip === 'bringForward' && (
              <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                Increases stack index by 1
              </div>
            )}
          </div>
        )}
      </Button>
      <Button
        onClick={handleSendToBack}
        className="w-full flex items-center justify-between"
        onMouseEnter={() => setHoveredButton('sendToBack')}
        onMouseLeave={() => setHoveredButton('')}
      >
        Min Z-Index
        {hoveredButton === 'sendToBack' && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip('sendToBack')}
            onMouseLeave={() => setShowTooltip('')}
          >
            <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
            {showTooltip === 'sendToBack' && (
              <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                Minimum stack index
              </div>
            )}
          </div>
        )}
      </Button>
      <Button
        onClick={handleSendBackward}
        className="w-full flex items-center justify-between"
        onMouseEnter={() => setHoveredButton('sendBackward')}
        onMouseLeave={() => setHoveredButton('')}
      >
        Z-Index--
        {hoveredButton === 'sendBackward' && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip('sendBackward')}
            onMouseLeave={() => setShowTooltip('')}
          >
            <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
            {showTooltip === 'sendBackward' && (
              <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                Decreases stack index by 1
              </div>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};
