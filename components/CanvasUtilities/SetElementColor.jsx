"use client";

import { canvasService } from "@/services/canvasService";
import { colorService } from "@/services/colorService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  hexToRgb,
  rgbToHex,
  validateHex,
  rgbStringToHex,
} from "@/utils/colorUtils";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";

export default function SetElementColor() {
  const [color, setColor] = useState("#000000");
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexInput, setHexInput] = useState("#000000");

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
    x2: 100,
    y2: 100,
    r1: 0,
    r2: 100,
  });

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
    const newRgbColor = { ...rgbColor, [name]: parseInt(value || 0, 10) };
    setRgbColor(newRgbColor);
    const hexColor = rgbToHex(newRgbColor.r, newRgbColor.g, newRgbColor.b);
    setColor(hexColor);
  };

  const handleGradientStopChange = (index, field, value) => {
    const newStops = [...gradientStops];
    newStops[index] = { ...newStops[index], [field]: value || "" };
    setGradientStops(newStops);
  };

  const handleGradientCoordChange = (field, value) => {
    setGradientCoords((prev) => ({ ...prev, [field]: parseFloat(value || 0) }));
  };

  const handleGradientTypeChange = (value) => {
    setGradientType(value);
    if (value === "linear") {
      setGradientCoords({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100,
        r1: 0,
        r2: 100,
      });
    }
    else if (value === "radial") {
      setGradientCoords({
        x1: 50,
        y1: 50,
        x2: 50,
        y2: 50,
        r1: 0,
        r2: 50,
      });
    }
  };

  const handleApplyGradient = () => {
    colorService.setGradient({
      type: gradientType,
      coords:
        gradientType === "radial"
          ? {
              x1: gradientCoords.x1,
              y1: gradientCoords.y1,
              r1: gradientCoords.r1,
              x2: gradientCoords.x2,
              y2: gradientCoords.y2,
              r2: gradientCoords.r2,
            }
          : gradientCoords,
      colorStops: gradientStops,
    });
  };

  useEffect(() => {
    colorService.setElementColor(color);
    setHexInput(color);
    updateRgbColor(color);
  }, [color]);

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElements) => {
      if (selectedElements && selectedElements.length === 1) {
        const element = selectedElements[0];
        if (element.fill instanceof canvasService.fabricModule.Gradient) {
          setIsGradient(true);
          setGradientType(element.fill.type);
          setGradientStops(element.fill.colorStops);
          if (element.fill.coords) {
            setGradientCoords({
              ...element.fill.coords,
              r1: element.fill.coords.r1 || 0,
              r2: element.fill.coords.r2 || (element.fill.type === "radial" ? 50 : 100),
            });
          } else {
            setGradientCoords(
              element.fill.type === "linear"
                ? { x1: 0, y1: 0, x2: 100, y2: 100, r1: 0, r2: 100 }
                : { x1: 50, y1: 50, x2: 50, y2: 50, r1: 0, r2: 50 }
            );
          }
        } else {
          const fillColor = selectedElements[0]?.fill || `rgb(0, 0, 0)`;
          setColor(rgbStringToHex(fillColor));
        }
      } else {
        setColor("#000000");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-3">
        <h3 className="font-semibold text-sm text-gray-300">Element Color</h3>
        <div className="relative w-8 h-8 rounded-md overflow-hidden shadow-sm">
          <Input
            type="color"
            onChange={(e) => setColor(e.target.value)}
            value={color || "#000000"}
            className="absolute inset-0 w-full h-full -p-2 cursor-pointer"
          />
        </div>
        <div className="flex-grow" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-300 hover:bg-gray-800 px-2 py-1 rounded-md"
        >
          {showAdvanced ? (
            <FaChevronUp className="w-4 h-4" />
          ) : (
            <FaChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-700">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Color type</Label>
            <ToggleGroup
              type="single"
              onValueChange={(value) => setIsGradient(value)}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem
                value={false}
                className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-4 py-2 text-sm rounded-md border border-gray-700 hover:bg-gray-800"
              >
                Solid
              </ToggleGroupItem>
              <ToggleGroupItem
                value={true}
                className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-4 py-2 text-sm rounded-md border border-gray-700 hover:bg-gray-800"
              >
                Gradient
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {!isGradient && (
            <>
              <form onSubmit={handleHexSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={hexInput || ""}
                    onChange={(e) => setHexInput(e.target.value)}
                    placeholder="#FFFFFF"
                    className="w-full pl-8"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                    #
                  </span>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  Apply
                </Button>
              </form>

              <div className="space-y-2">
                <Label className="text-sm text-gray-300">RGB Values</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["r", "g", "b"].map((channel) => (
                    <div key={channel} className="space-y-1">
                      <Label className="text-xs text-gray-400 uppercase">
                        {channel}
                      </Label>
                      <Input
                        type="number"
                        name={channel}
                        value={rgbColor[channel] || 0}
                        onChange={changeRgbColor}
                        className="w-full"
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Gradient Type</Label>
                <ToggleGroup
                  type="single"
                  value={gradientType}
                  onValueChange={handleGradientTypeChange}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem
                    value="linear"
                    className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-4 py-2 text-sm rounded-md border border-gray-700 hover:bg-gray-800"
                  >
                    Linear
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="radial"
                    className="data-[state=on]:bg-gray-800 data-[state=on]:text-gray-100 px-4 py-2 text-sm rounded-md border border-gray-700 hover:bg-gray-800"
                  >
                    Radial
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-300">
                  Gradient Coordinates
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {["x1", "y1", "x2", "y2"].map((coord) => (
                    <div key={coord} className="space-y-1">
                      <Label className="text-xs text-gray-400 capitalize">
                        {coord.replace("x", "X ").replace("y", "Y ")}
                      </Label>
                      <Input
                        type="number"
                        value={gradientCoords[coord] || 0}
                        onChange={(e) =>
                          handleGradientCoordChange(coord, e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                  {gradientType === "radial" && (
                    <>
                      {["r1", "r2"].map((radius) => (
                        <div key={radius} className="space-y-1">
                          <Label className="text-xs text-gray-400 capitalize">
                            {radius.replace("r", "Radius ")}
                          </Label>
                          <Input
                            type="number"
                            value={gradientCoords[radius] || 0}
                            onChange={(e) =>
                              handleGradientCoordChange(radius, e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Gradient Stops</Label>
                <div className="space-y-2">
                  {gradientStops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={stop.offset || 0}
                          onChange={(e) =>
                            handleGradientStopChange(
                              index,
                              "offset",
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Offset"
                          className="w-full"
                          min="0"
                          max="1"
                          step="0.1"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          %
                        </span>
                      </div>
                      <div className="relative w-8 h-8 rounded-md overflow-hidden shadow-sm">
                        <Input
                          type="color"
                          value={stop.color || "#000000"}
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
                className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700"
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
