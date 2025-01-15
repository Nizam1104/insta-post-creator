"use client"

import { useState, useEffect } from "react"
import { canvasService } from "@/services/canvasService"
import { useDebounce } from "@/hooks/useDebounce"
import { opacityService } from "@/services/opacityService"

export default function SetElementOpacity() {
  const [opacity, setOpacity] = useState(100)
  const debouncedOpacity = useDebounce(opacity, 100)

  useEffect(() => {
    opacityService.setElementOpacity(debouncedOpacity / 100)
  }, [debouncedOpacity])

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElement) => {
      if (selectedElement && selectedElement?.length === 1) {
        const elementOpacity = selectedElement[0]?.opacity * 100
        if (!isNaN(elementOpacity)) {
          setOpacity(elementOpacity)
        } else {
          setOpacity(100)
        }
      } else {
        setOpacity(100)
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div className="bg-gray-900 p-2 rounded-md">
      <h2 className="text-gray-400 font-semibold text-sm">Set Opacity</h2>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500">Opacity {opacity}%</label>
        <input
          type="range"
          value={isNaN(opacity) ? 100 : opacity}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (!isNaN(value)) {
              setOpacity(value)
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
