"use client"

import { canvasService } from "@/services/canvasService";
import { colorService } from "@/services/colorService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { hexToRgb, rgbToHex, validateHex, rgbStringToHex } from "@/utils/colorUtils";

export default function SetElementColor() {
  const [color, setColor] = useState("#000000");
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexInput, setHexInput] = useState("#000000");

  const handleHexSubmit = (e) => {
    e.preventDefault();
    if (validateHex(hexInput)) {
      setColor(hexInput);
      updateRgbColor(hexInput);
    }
  };

  const updateRgbColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      setRgbColor(rgb);
    }
  };

  const changeRgbColor = (e) => {
    const { name, value } = e.target;
    const newRgbColor = { ...rgbColor, [name]: parseInt(value, 10) };
    setRgbColor(newRgbColor);
    const hexColor = rgbToHex(newRgbColor.r, newRgbColor.g, newRgbColor.b);
    setColor(hexColor);
  };

  useEffect(() => {
    colorService.setElementColor(color);
    setHexInput(color);
    updateRgbColor(color);
  }, [color]);

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElement) => {
      if (selectedElement && selectedElement.length === 1) {
        setColor(rgbStringToHex(selectedElement[0]?.fill || `rgb(0, 0, 0)`))
      } else {
        setColor('#000000')
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-2 bg-gray-900 p-2 rounded-md">
      {/* Minimal Color Picker */}
      <div className="flex items-center space-x-2">
        <h3 className="font-semibold text-sm text-gray-400">Set Color</h3>
        <Input 
          type="color"
          onChange={e => setColor(e.target.value)} 
          value={color} 
          className="w-10 h-8 p-1"
        />
        <div className="flex flex-grow" />
        <Button
          variant="secondary"
          size="sm" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
        >
          {showAdvanced ? "Less" : "More"}
        </Button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-2">
          {/* Hex Color Input */}
          <form onSubmit={handleHexSubmit} className="flex items-center space-x-2">
            <Input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#FFFFFF"
              className="w-24"
            />
            <Button type="submit" size="sm" className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">Set</Button>
          </form>

          {/* RGB Inputs */}
          <div>
            <Label className="block mb-2">Set RGB Values:</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                name="r"
                value={rgbColor.r}
                onChange={changeRgbColor}
                className="w-1/3"
                min="0"
                max="255"
              />
              <Input
                type="number"
                name="g"
                value={rgbColor.g}
                onChange={changeRgbColor}
                className="w-1/3"
                min="0"
                max="255"
              />
              <Input
                type="number"
                name="b"
                value={rgbColor.b}
                onChange={changeRgbColor}
                className="w-1/3"
                min="0"
                max="255"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
