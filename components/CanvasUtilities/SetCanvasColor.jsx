"use client";

import { canvasState } from "@/services/canvasState";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { hexToRgb, rgbToHex, validateHex } from "@/utils/colorUtils";
import { colorService } from "@/services/colorService";

export default function SetCanvasColor() {
  const [color, setColor] = useState("#ffffff");
  const [rgbColor, setRgbColor] = useState({ r: 255, g: 255, b: 255 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexInput, setHexInput] = useState("#ffffff");
  const [isGradient, setIsGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientStops, setGradientStops] = useState([
    { offset: 0, color: "#FF0000" },
    { offset: 0.5, color: "#00FF00" },
    { offset: 1, color: "#0000FF" },
  ]);
  const [gradientCoords, setGradientCoords] = useState({
    x1: 0,
    y1: 0,
    x2: 500,
    y2: 500,
    r1: 0,
    r2: 500,
  });

  useEffect(() => {
    if (canvasState.isCanvasReady()) {
      const currentBgColor = canvasState.getCanvasBackgroundColor();
      
      if (typeof currentBgColor === 'object' && currentBgColor.type) {
        setIsGradient(true);
        setGradientType(currentBgColor.type);
        if (currentBgColor.coords) setGradientCoords(currentBgColor.coords);
        if (currentBgColor.colorStops) setGradientStops(currentBgColor.colorStops);
      } else if (typeof currentBgColor === 'string') {
        setIsGradient(false);
        setColor(currentBgColor);
        setHexInput(currentBgColor);
        updateRgbColor(currentBgColor);
      }
    }
  }, []);

  const handleHexSubmit = (e) => {
    e.preventDefault();
    if (validateHex(hexInput)) {
      setColor(hexInput);
      updateRgbColor(hexInput);
      colorService.setCanvasColor(hexInput)
    }
  };

  const updateRgbColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) setRgbColor(rgb);
  };

  const changeRgbColor = (e) => {
    const { name, value } = e.target;
    const newRgbColor = { ...rgbColor, [name]: parseInt(value, 10) };
    setRgbColor(newRgbColor);
    const hexColor = rgbToHex(newRgbColor.r, newRgbColor.g, newRgbColor.b);
    setColor(hexColor);
    colorService.setCanvasColor(hexColor);
  };

  const handleGradientStopChange = (index, field, value) => {
    const newStops = [...gradientStops];
    newStops[index] = { ...newStops[index], [field]: value };
    setGradientStops(newStops);
  };

  const handleGradientCoordChange = (field, value) => {
    setGradientCoords((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleGradientTypeChange = (value) => {
    setGradientType(value);
    setGradientCoords(
      value === "linear"
        ? { x1: 0, y1: 0, x2: 500, y2: 500, r1: 0, r2: 500 }
        : { x1: 0, y1: 0, x2: 500, y2: 500, r1: 0, r2: 500 }
    );
  };

  const handleApplyGradient = () => {
    colorService.setCanvasColor({
      type: gradientType,
      coords: gradientCoords,
      colorStops: gradientStops,
    });
  };

  return (
    <div className="text-white bg-gray-900 p-2 rounded-md border border-gray-700">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-gray-400">Canvas Color</h2>
        <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-sm">
          <Input
            type="color"
            onChange={(e) => {
              setColor(e.target.value);
              colorService.setCanvasColor(e.target.value);
            }}
            value={color}
            className="absolute inset-0 w-full h-full cursor-pointer -p-2"
          />
        </div>
        <div className="flex-grow" />
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-300 hover:bg-gray-800 px-1.5 py-1 rounded-md"
        >
          {showAdvanced ? (
            <FaChevronUp className="w-3 h-3" />
          ) : (
            <FaChevronDown className="w-3 h-3" />
          )}
        </Button>
      </div>

      {showAdvanced && (
        <div className="pt-2 border-t border-gray-700">
          <div className="mb-2">
            <Label className="text-xs text-gray-300">Color type</Label>
            <ToggleGroup
              type="single"
              onValueChange={(value) => setIsGradient(value)}
              className="grid grid-cols-2 gap-1"
            >
              <ToggleGroupItem
                value={false}
                className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-2 py-1 text-xs rounded-md border border-gray-700 hover:bg-gray-800"
              >
                Solid
              </ToggleGroupItem>
              <ToggleGroupItem
                value={true}
                className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-2 py-1 text-xs rounded-md border border-gray-700 hover:bg-gray-800"
              >
                Gradient
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {!isGradient && (
            <>
              <form onSubmit={handleHexSubmit} className="flex items-center gap-1 mb-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    placeholder="#FFFFFF"
                    className="w-full pl-6 text-sm"
                  />
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    #
                  </span>
                </div>
                <Button
                  type="submit"
                  size="xs"
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700 px-2"
                >
                  Apply
                </Button>
              </form>

              <div className="mb-2">
                <Label className="text-xs text-gray-300">RGB Values</Label>
                <div className="grid grid-cols-3 gap-1">
                  {["r", "g", "b"].map((channel) => (
                    <div key={channel}>
                      <Input
                        type="number"
                        name={channel}
                        value={rgbColor[channel]}
                        onChange={changeRgbColor}
                        className="w-full text-sm"
                        min="0"
                        max="255"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isGradient && (
            <div className="space-y-2">
              <div className="mb-1">
                <Label className="text-xs text-gray-300">Gradient Type</Label>
                <ToggleGroup
                  type="single"
                  value={gradientType}
                  onValueChange={handleGradientTypeChange}
                  className="grid grid-cols-2 gap-1"
                >
                  <ToggleGroupItem
                    value="linear"
                    className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-2 py-1 text-xs rounded-md border border-gray-700 hover:bg-gray-800"
                  >
                    Linear
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="radial"
                    className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-2 py-1 text-xs rounded-md border border-gray-700 hover:bg-gray-800"
                  >
                    Radial
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="mb-1">
                <Label className="text-xs text-gray-300">Coordinates</Label>
                <div className="grid grid-cols-2 gap-1">
                  {["x1", "y1", "x2", "y2"].map((coord) => (
                    <div key={coord}>
                      <Input
                        type="number"
                        value={gradientCoords[coord]}
                        onChange={(e) =>
                          handleGradientCoordChange(coord, e.target.value)
                        }
                        className="w-full text-sm"
                      />
                    </div>
                  ))}
                  {gradientType === "radial" && (
                    <>
                      {["r1", "r2"].map((radius) => (
                        <div key={radius}>
                          <Input
                            type="number"
                            value={gradientCoords[radius]}
                            onChange={(e) =>
                              handleGradientCoordChange(radius, e.target.value)
                            }
                            className="w-full text-sm"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-1">
                <Label className="text-xs text-gray-300">Stops</Label>
                <div className="space-y-1">
                  {gradientStops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={stop.offset}
                          onChange={(e) =>
                            handleGradientStopChange(
                              index,
                              "offset",
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Offset"
                          className="w-full text-sm"
                          min="0"
                          max="1"
                          step="0.1"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          %
                        </span>
                      </div>
                      <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-sm">
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            handleGradientStopChange(
                              index,
                              "color",
                              e.target.value
                            )
                          }
                          className="absolute inset-0 w-full h-full -p-2 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleApplyGradient}
                className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm"
              >
                Apply Gradient
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
