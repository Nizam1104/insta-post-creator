"use client";
import { useEffect, useState } from "react";
import { canvasService } from "@/services/canvasService";
import { Button } from "../ui/button";
import { shadowService } from "@/services/shadowService";

export default function SetElementShadow() {
  const [shadowOptions, setShadowOptions] = useState({
    color: "rgba(0,0,0,0.5)",
    blur: 10,
    offsetX: 5,
    offsetY: 5,
  });

  const handleChange = (key, value) => {
    const actualValue = Array.isArray(value) ? value[0] : value;
    const newOptions = { ...shadowOptions, [key]: actualValue };
    setShadowOptions(newOptions);
    shadowService.setElementShadow(newOptions);
  };

  const handleRemoveShadow = () => {
    setShadowOptions({
      color: "rgba(0,0,0,0.5)",
      blur: 0,
      offsetX: 0,
      offsetY: 0,
    });
    setTimeout(() => {
      shadowService.removeElementShadow();
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
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-1 p-1 bg-gray-900 text-gray-400 rounded-md text-xs">
      <h3 className="font-semibold text-gray-400 text-sm mb-1">Shadow</h3>
      
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={shadowOptions.color}
          onChange={(e) => handleChange("color", e.target.value)}
          className="w-6 h-6 bg-gray-800 rounded-md border border-gray-700 focus:ring-1 focus:ring-blue-500"
        />
        
        <div className="flex-1">
          <label className="text-xs">Blur ({shadowOptions.blur}px)</label>
          <input
            type="range"
            value={shadowOptions.blur}
            onChange={(e) => handleChange("blur", parseInt(e.target.value))}
            min={1}
            max={100}
            className="w-full h-1 bg-gray-800 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div>
          <label className="text-xs">X ({shadowOptions.offsetX}px)</label>
          <input
            type="range"
            value={shadowOptions.offsetX}
            onChange={(e) => handleChange("offsetX", parseInt(e.target.value))}
            min={-100}
            max={100}
            className="w-full h-1 bg-gray-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs">Y ({shadowOptions.offsetY}px)</label>
          <input
            type="range"
            value={shadowOptions.offsetY}
            onChange={(e) => handleChange("offsetY", parseInt(e.target.value))}
            min={-100}
            max={100}
            className="w-full h-1 bg-gray-800 rounded-lg"
          />
        </div>
      </div>

      <Button
        size="xs"
        onClick={handleRemoveShadow}
        className="mt-1 bg-red-600 hover:bg-red-700 text-white h-6"
      >
        Remove
      </Button>
    </div>
  );
}
