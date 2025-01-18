"use client"

import { useEffect, useState } from "react";
import { canvasService } from "@/services/canvasService";
import { colorService } from "@/services/colorService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { hexToRgb, rgbToHex, validateHex, rgbStringToHex } from "@/utils/colorUtils";

export default function SetElementColor() {
  // Basic color state
  const [color, setColor] = useState("#000000");
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexInput, setHexInput] = useState("#000000");

  // Gradient state
  const [isGradient, setIsGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientColors, setGradientColors] = useState([
    { offset: 0, color: "#000000" },
    { offset: 1, color: "#FFFFFF" }
  ]);

  // Add new state for pending gradient
  const [pendingGradient, setPendingGradient] = useState(null);

  // Helper function to normalize gradient offsets
  const normalizeGradientOffsets = (colors) => {
    return colors.map((stop, index) => ({
      ...stop,
      offset: Math.max(0, Math.min(1, parseFloat(stop.offset) || index / (colors.length - 1)))
    })).sort((a, b) => a.offset - b.offset);
  };

  // Helper function to normalize hex color
  const normalizeHexColor = (hexColor) => {
    // Remove hash if present
    let color = hexColor.replace('#', '');
    // Take only the first 6 characters if longer
    color = color.substring(0, 6);
    // Add hash back
    return `#${color}`;
  };

  // Handle hex color input
  const handleHexSubmit = (e) => {
    e.preventDefault();
    if (validateHex(hexInput)) {
      setColor(hexInput);
      updateRgbColor(hexInput);
      applyColorToSelected(hexInput);
    }
  };

  // Update RGB values when hex color changes
  const updateRgbColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      setRgbColor(rgb);
    }
  };

  // Handle RGB input changes
  const handleRgbChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, Math.min(255, parseInt(value || 0, 10)));
    const newRgbColor = { ...rgbColor, [name]: numValue };
    setRgbColor(newRgbColor);
    const hexColor = rgbToHex(newRgbColor.r, newRgbColor.g, newRgbColor.b);
    setColor(hexColor);
    applyColorToSelected(hexColor);
  };

  // Handle gradient color stop changes
  const handleGradientColorChange = (index, newColor) => {
    const normalizedColor = normalizeHexColor(newColor);
    const newColors = [...gradientColors];
    newColors[index] = { ...newColors[index], color: normalizedColor };
    const normalizedColors = normalizeGradientOffsets(newColors);
    setGradientColors(normalizedColors);
    
    setPendingGradient({
      type: gradientType,
      coords: getDefaultCoords(canvasService.canvas.getActiveObject()),
      colorStops: normalizedColors
    });
  };

  // Handle gradient offset changes
  const handleGradientOffsetChange = (index, offset) => {
    const newColors = [...gradientColors];
    newColors[index] = { ...newColors[index], offset: parseFloat(offset) || 0 };
    const normalizedColors = normalizeGradientOffsets(newColors);
    setGradientColors(normalizedColors);
    
    // Update pending gradient
    setPendingGradient({
      type: gradientType,
      coords: getDefaultCoords(canvasService.canvas.getActiveObject()),
      colorStops: normalizedColors
    });
  };

  // Add new gradient color stop
  const addGradientStop = () => {
    const currentColors = [...gradientColors];
    const middleOffset = currentColors.length > 1 
      ? (currentColors[0].offset + currentColors[currentColors.length - 1].offset) / 2 
      : 0.5;
    
    const newStop = {
      offset: middleOffset,
      color: color
    };
    
    setGradientColors(normalizeGradientOffsets([...currentColors, newStop]));
  };

  // Remove gradient color stop
  const removeGradientStop = (index) => {
    if (gradientColors.length <= 2) return;
    const newColors = gradientColors.filter((_, i) => i !== index);
    setGradientColors(normalizeGradientOffsets(newColors));
    applyGradientToSelected(newColors);
  };

  // Toggle between solid color and gradient
  const toggleGradient = () => {
    setIsGradient(!isGradient);
    const activeObject = canvasService.canvas.getActiveObject();
    
    if (!isGradient) {
      // Switching to gradient
      const newGradientColors = [
        { offset: 0, color: color },
        { offset: 1, color: "#FFFFFF" }
      ];
      setGradientColors(newGradientColors);
      
      // Set pending gradient when switching to gradient mode
      setPendingGradient({
        type: gradientType,
        coords: getDefaultCoords(activeObject),
        colorStops: newGradientColors
      });
    } else {
      // Switching to solid color
      applyColorToSelected(color);
      setPendingGradient(null);
    }
  };

  // New function to apply pending gradient
  const applyPendingGradient = () => {
    if (!pendingGradient) return;
    
    const activeObject = canvasService.canvas.getActiveObject();
    if (activeObject) {
      colorService.setGradient(pendingGradient);
      setPendingGradient(null);
    }
  };

  // Apply solid color to selected object
  const applyColorToSelected = (newColor) => {
    const activeObject = canvasService.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', newColor);
      canvasService.canvas.requestRenderAll();
      colorService.setElementColor(newColor);
    }
  };

  // Get default coordinates for gradient
  const getDefaultCoords = (object) => {
    const bounds = object?.getBoundingRect();
    if (!bounds) return {};
    
    if (gradientType === 'linear') {
      return {
        x1: bounds.left || 0,
        y1: bounds.top || 0,
        x2: bounds.left + bounds.width || 100,
        y2: bounds.top || 0
      };
    }
    
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) / 2;
    
    return {
      x1: centerX,
      y1: centerY,
      r1: 0,
      x2: centerX,
      y2: centerY,
      r2: radius
    };
  };

  // Apply gradient to selected object
  const applyGradientToSelected = (colors) => {
    const activeObject = canvasService.canvas.getActiveObject();
    if (activeObject) {
      const normalizedColors = normalizeGradientOffsets(colors);
      const coords = getDefaultCoords(activeObject);
      
      try {
        colorService.setGradient({
          type: gradientType,
          coords: coords,
          colorStops: normalizedColors.map(stop => ({
            offset: stop.offset,
            color: stop.color
          }))
        });
      } catch (error) {
        console.error('Error applying gradient:', error);
      }
    }
  };

  // Update gradient type
  const handleGradientTypeChange = (type) => {
    setGradientType(type);
    if (isGradient) {
      setPendingGradient({
        type: type,
        coords: getDefaultCoords(canvasService.canvas.getActiveObject()),
        colorStops: gradientColors
      });
    }
  };

  // Handle selection changes
  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElements) => {
      if (selectedElements?.length === 1) {
        const element = selectedElements[0];
        if (element.fill instanceof canvasService.fabricModule.Gradient) {
          setIsGradient(true);
          setGradientType(element.fill.type);
          const normalizedColors = normalizeGradientOffsets(element.fill.colorStops.map(stop => ({
            ...stop,
            color: normalizeHexColor(stop.color)
          })));
          setGradientColors(normalizedColors);
          setPendingGradient(null);
        } else {
          setIsGradient(false);
          setPendingGradient(null);
          const newColor = normalizeHexColor(rgbStringToHex(element.fill || "#000000"));
          setColor(newColor);
          setHexInput(newColor);
          updateRgbColor(newColor);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-4 bg-gray-900 p-4 rounded-md">
      {/* Basic Color Picker */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm text-gray-400">Color:</Label>
        <Input 
          type="color"
          onChange={e => {
            const newColor = e.target.value;
            setColor(newColor);
            setHexInput(newColor);
            updateRgbColor(newColor);
            if (!isGradient) {
              applyColorToSelected(newColor);
            }
          }}
          value={color} 
          className="w-10 h-8 -p-2"
        />
        <div className="flex-grow" />
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleGradient}
          className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
        >
          {isGradient ? "Solid Color" : "Gradient"}
        </Button>
        <Button
          variant="secondary"
          size="sm" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
        >
          {showAdvanced ? "Basic" : "Advanced"}
        </Button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4">
          {/* Hex Input */}
          <div>
            <Label className="block mb-2 text-sm">Hex Color:</Label>
            <form onSubmit={handleHexSubmit} className="flex items-center space-x-2">
              <Input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#FFFFFF"
                className="w-28"
              />
              <Button 
                type="submit" 
                size="sm"
                className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
              >
                Apply
              </Button>
            </form>
          </div>

          {/* RGB Inputs */}
          <div>
            <Label className="block mb-2 text-sm">RGB Values:</Label>
            <div className="flex space-x-2">
              <div className="w-1/3">
                <Label className="text-xs">R</Label>
                <Input
                  type="number"
                  name="r"
                  value={rgbColor.r}
                  onChange={handleRgbChange}
                  min="0"
                  max="255"
                />
              </div>
              <div className="w-1/3">
                <Label className="text-xs">G</Label>
                <Input
                  type="number"
                  name="g"
                  value={rgbColor.g}
                  onChange={handleRgbChange}
                  min="0"
                  max="255"
                />
              </div>
              <div className="w-1/3">
                <Label className="text-xs">B</Label>
                <Input
                  type="number"
                  name="b"
                  value={rgbColor.b}
                  onChange={handleRgbChange}
                  min="0"
                  max="255"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Editor */}
      {isGradient && (
        <div className="space-y-4">
          <div>
            <Label className="block mb-2 text-sm">Gradient Type:</Label>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleGradientTypeChange('linear')}
                className={`w-1/2 ${gradientType === 'linear' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-black'}`}
              >
                Linear
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleGradientTypeChange('radial')}
                className={`w-1/2 ${gradientType === 'radial' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-black'}`}
              >
                Radial
              </Button>
            </div>
          </div>

          <div>
            <Label className="block mb-2 text-sm">Color Stops:</Label>
            <div className="space-y-2">
              {gradientColors.map((stop, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleGradientColorChange(index, e.target.value)}
                    className="w-12"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={stop.offset}
                    onChange={(e) => handleGradientOffsetChange(index, e.target.value)}
                    className="w-20"
                  />
                  {gradientColors.length > 2 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeGradientStop(index)}
                      className="px-2"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {gradientColors.length < 5 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={addGradientStop}
                className="mt-2"
              >
                Add Color Stop
              </Button>
            )}
          </div>

          {/* Add Apply Gradient button */}
          {pendingGradient && (
            <Button
              onClick={applyPendingGradient}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Apply Gradient
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
