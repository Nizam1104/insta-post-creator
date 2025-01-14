"use client";
import { useEffect, useState } from "react";
import { canvasService } from "@/services/canvasService";
import { Button } from "../ui/button";

export default function SetElementShadow() {
  const [shadowOptions, setShadowOptions] = useState({
    color: "rgba(0,0,0,0.5)",
    blur: 10,
    offsetX: 5,
    offsetY: 5,
  });

  const handleChange = (key, value) => {
    // Handle array values from Slider
    const actualValue = Array.isArray(value) ? value[0] : value;
    const newOptions = { ...shadowOptions, [key]: actualValue };
    setShadowOptions(newOptions);
    canvasService.setElementShadow(newOptions);
  };

  const handleRemoveShadow = () => {
    // Reset shadow options with 0 offsets
    setShadowOptions({
      color: "rgba(0,0,0,0.5)",
      blur: 0,
      offsetX: 0,
      offsetY: 0,
    });

    // Then remove shadow from canvas
    setTimeout(() => {
      canvasService.removeElementShadow();
    }, 0);
  };

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElement) => {
      if (selectedElement && selectedElement.length === 1) {
        const shadowProperties = selectedElement[0]?.shadow || {}
        if (Object.keys(shadowProperties).length) {
          setShadowOptions({
            color: shadowProperties.color || "rgba(0,0,0,0.5)",
            blur: shadowProperties.blur || 10,
            offsetX: shadowProperties.offsetX || 5,
            offsetY: shadowProperties.offsetY || 5
          });
        }
      } else {
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-900 text-gray-400 rounded-md">
      <h3 className="font-semibold text-gray-400 text-base">
        Set Shadow properties
      </h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Shadow Color</label>
        <input
          type="color"
          value={shadowOptions.color}
          onChange={(e) => handleChange("color", e.target.value)}
          className="w-full h-10 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Blur ({shadowOptions.blur}px)</label>
        <input
          type="range"
          value={shadowOptions.blur}
          onChange={(e) => handleChange("blur", parseInt(e.target.value))}
          min={1}
          max={100}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:bg-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">
          Horizontal Offset ({shadowOptions.offsetX}px)
        </label>
        <input
          type="range"
          value={shadowOptions.offsetX}
          onChange={(e) => handleChange("offsetX", parseInt(e.target.value))}
          min={-100}
          max={100}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:bg-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">
          Vertical Offset ({shadowOptions.offsetY}px)
        </label>
        <input
          type="range"
          value={shadowOptions.offsetY}
          onChange={(e) => handleChange("offsetY", parseInt(e.target.value))}
          min={-100}
          max={100}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:bg-blue-500"
        />
      </div>

      <Button
        type="primary"
        size="sm"
        onClick={handleRemoveShadow}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white"
      >
        Remove Shadow
      </Button>
    </div>
  );
}
