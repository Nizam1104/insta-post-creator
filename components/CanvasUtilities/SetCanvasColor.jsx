"use client"
import { canvasService } from "@/services/canvasService"
import { useEffect, useState } from "react";

export default function SetCanvasColor() {
  const [canvasColor, setCanvasColor] = useState('#ffffff');
  const [rgbColor, setRgbColor] = useState({ r: 255, g: 255, b: 255 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexColorCode, setHexColorCode] = useState('#ffffff');

  useEffect(() => {
    const savedColor = localStorage.getItem('postCanvasBgColour') || '#ffffff';
    setCanvasColor(savedColor);
    setHexColorCode(savedColor);
  }, []);

  const changeColor = (e) => {
    const color = e.target.value;
    canvasService.setCanvasColor(color);
    setCanvasColor(color);
    updateRgbColor(color);
  };

  const setCnvsClrfrmHexInput = () => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(hexColorCode)) {
      canvasService.setCanvasColor(hexColorCode);
      setCanvasColor(hexColorCode);
      updateRgbColor(hexColorCode);
    }
  };

  const changeRgbColor = (e) => {
    const { name, value } = e.target;
    const newRgbColor = { ...rgbColor, [name]: parseInt(value, 10) };
    setRgbColor(newRgbColor);
    const hexColor = rgbToHex(newRgbColor.r, newRgbColor.g, newRgbColor.b);
    canvasService.setCanvasColor(hexColor);
    setCanvasColor(hexColor);
  };

  const updateRgbColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      setRgbColor(rgb);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  useEffect(() => {
    setRgbColor(hexToRgb(canvasColor))
  }, [canvasColor])

  return (
    <div className="text-white space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-base font-semibold">Set Background color: </span>
        <input 
          type="color" 
          onChange={changeColor}
          value={canvasColor}
          className="w-8 h-8 border border-gray-100"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
        >
          More
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4">
          <div className="">
            <div className="flex flex-col">
            <label htmlFor="colorCode" className="block mb-2">Enter Hex Color Code:</label>
            <div className="flex space-x-2">
            <input
              id="colorCode"
              type="text" 
              onChange={(e) => setHexColorCode(e.target.value)}
              value={hexColorCode}
              className="w-full p-2 bg-gray-700 rounded"
              placeholder="#FFFFFF"
            />
            <button onClick={setCnvsClrfrmHexInput} className="px-8 py-1 bg-blue-500 text-sm rounded-md">Set</button>
            </div>
            </div>
          </div>

          <div>
            <label className="block mb-2">Set RGB Values:</label>
            <div className="flex space-x-2">
              <input 
                type="number"
                name="r"
                value={rgbColor.r}
                onChange={changeRgbColor}
                className="w-1/3 p-2 bg-gray-700 rounded"
                min="0"
                max="255"
              />
              <input 
                type="number"
                name="g"
                value={rgbColor.g}
                onChange={changeRgbColor}
                className="w-1/3 p-2 bg-gray-700 rounded"
                min="0"
                max="255"
              />
              <input 
                type="number"
                name="b"
                value={rgbColor.b}
                onChange={changeRgbColor}
                className="w-1/3 p-2 bg-gray-700 rounded"
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
