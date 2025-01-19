"use client"

import { useState, useEffect } from "react"
import { canvasService } from "@/services/canvasService"
import { useDebounce } from "@/hooks/useDebounce"
import { shapesService } from "@/services/shapesService"

export default function SetCornerRadius() {
  const [radius, setRadius] = useState(0)
  const debouncedRadius = useDebounce(radius, 100)

  useEffect(() => {
    shapesService.setCornerRadius(debouncedRadius)
  }, [debouncedRadius])

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElement) => {
      if (selectedElement && selectedElement?.length === 1) {
        const activeObject = selectedElement[0];
        // Handle different shape types
        let elementRadius = 0;
        
        if (activeObject.type === 'rect') {
          elementRadius = activeObject.rx || activeObject.ry || 0;
        } else if (activeObject.type === 'path') {
          // For paths, we can't directly get radius but can check for curves
          elementRadius = 0; // Paths don't have a direct radius property
        } else if (activeObject.type === 'polygon') {
          elementRadius = activeObject.cornerSize ? activeObject.cornerSize / 2 : 0;
        }
        console.log(elementRadius)

        if (!isNaN(elementRadius)) {
          setRadius(elementRadius);
        } else {
          setRadius(0);
        }
      } else {
        setRadius(0);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div className="bg-gray-900 p-2 rounded-md">
      <h2 className="text-gray-400 font-semibold text-sm">Set Corner Radius</h2>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500">Radius {radius}px</label>
        <input
          type="range"
          value={isNaN(radius) ? 0 : radius}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (!isNaN(value)) {
              setRadius(value)
            }
          }}
          min={0}
          max={100}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:bg-blue-500"
        />
      </div>
    </div>
  )
}
