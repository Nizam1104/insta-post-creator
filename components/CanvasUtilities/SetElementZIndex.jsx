"use client"

import { zIndexService } from '@/services/zIndexService';
import { Button } from '../ui/button';
import { FaInfoCircle, FaInfinity } from 'react-icons/fa';
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
    <div className='flex flex-col p-1 bg-gray-900 rounded-md'>
      <h3 className='text-xs font-semibold text-gray-400 mb-1'>Stack Index</h3>
      <div className="flex justify-center items-center gap-x-2">
        <Button 
          onClick={handleBringToFront}
          className="flex items-center justify-center w-16 h-8 p-0"
          onMouseEnter={() => setHoveredButton('bringToFront')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400 flex items-center gap-1'>
            <span>Z =</span>
            <FaInfinity className="w-3 h-3" />
          </span>
          {hoveredButton === 'bringToFront' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('bringToFront')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-1 text-gray-400 hover:text-gray-200 w-3 h-3" />
              {showTooltip === 'bringToFront' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-1 rounded-md z-50">
                  Top Layer
                </div>
              )}
            </div>
          )}
        </Button>
        <Button 
          onClick={handleBringForward}
          className="flex items-center justify-center w-12 h-8 p-0"
          onMouseEnter={() => setHoveredButton('bringForward')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400'>Z++</span>
          {hoveredButton === 'bringForward' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('bringForward')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-1 text-gray-400 hover:text-gray-200 w-3 h-3" />
              {showTooltip === 'bringForward' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-1 rounded-md z-50">
                  Move Up
                </div>
              )}
            </div>
          )}
        </Button>
        <Button
          onClick={handleSendToBack}
          className="flex items-center justify-center w-16 h-8 p-0"
          onMouseEnter={() => setHoveredButton('sendToBack')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400'>Z = 0</span>
          {hoveredButton === 'sendToBack' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('sendToBack')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-1 text-gray-400 hover:text-gray-200 w-3 h-3" />
              {showTooltip === 'sendToBack' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-1 rounded-md z-50">
                  Bottom Layer
                </div>
              )}
            </div>
          )}
        </Button>
        <Button
          onClick={handleSendBackward}
          className="flex items-center justify-center w-12 h-8 p-0"
          onMouseEnter={() => setHoveredButton('sendBackward')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400'>Z--</span>
          {hoveredButton === 'sendBackward' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('sendBackward')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-1 text-gray-400 hover:text-gray-200 w-3 h-3" />
              {showTooltip === 'sendBackward' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-1 rounded-md z-50">
                  Move Down
                </div>
              )}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
