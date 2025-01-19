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
    <div className='flex flex-col p-2 bg-gray-900 rounded-md'>
      <h3 className='text-sm font-semibold text-gray-400'>Stack Index</h3>
        <div className="flex justify-center items-center gap-x-4 flex-wrap space-y-2">
        <Button 
          onClick={handleBringToFront}
          className="flex items-center justify-between w-fit min-w-[150px]"
          onMouseEnter={() => setHoveredButton('bringToFront')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400 flex space-x-2 items-center'>
            <span>Z =</span>
            <FaInfinity />
          </span>
          {hoveredButton === 'bringToFront' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('bringToFront')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
              {showTooltip === 'bringToFront' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                  Sets element at current Highest layer
                </div>
              )}
            </div>
          )}
        </Button>
        <Button 
          onClick={handleBringForward}
          className="flex items-center justify-between w-fit min-w-[150px]"
          onMouseEnter={() => setHoveredButton('bringForward')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400 flex space-x-2 items-center'>
            <span>Z++</span>
          </span>
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
          className="flex items-center justify-between w-fit min-w-[150px]"
          onMouseEnter={() => setHoveredButton('sendToBack')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400 flex space-x-2 items-center'>
            <span>Z = 0 </span>
          </span>
          {hoveredButton === 'sendToBack' && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip('sendToBack')}
              onMouseLeave={() => setShowTooltip('')}
            >
              <FaInfoCircle className="ml-2 text-gray-400 hover:text-gray-200" />
              {showTooltip === 'sendToBack' && (
                <div className="absolute top-6 right-0 bg-black text-white text-xs p-2 rounded-md z-50">
                  Set element at lowest layer
                </div>
              )}
            </div>
          )}
        </Button>
        <Button
          onClick={handleSendBackward}
          className="flex items-center justify-between w-fit min-w-[150px]"
          onMouseEnter={() => setHoveredButton('sendBackward')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span className='text-xs font-semibold text-gray-400 flex space-x-2 items-center'>
            <span>Z--</span>
          </span>
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
    </div>
  );
};
