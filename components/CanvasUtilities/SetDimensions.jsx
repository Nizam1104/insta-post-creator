"use client"

import React, { useState, useEffect } from 'react';
import { dimensionService } from '@/services/dimensionService';
import { canvasService } from '@/services/canvasService';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export default function SetDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
    radius: 0,
    radiusX: 0,
    radiusY: 0
  });
  const [shapeType, setShapeType] = useState(null);
  const [pendingDimensions, setPendingDimensions] = useState({});

  useEffect(() => {
    const unsubscribe = canvasService.subscribe((selectedElement) => {
      if (!selectedElement || selectedElement.length !== 1) return;
      
      const element = selectedElement[0];
      const currentDimensions = dimensionService.getDimensions();
      if (!currentDimensions) return;

      if (element.type === 'circle') {
        setShapeType('circle');
        setDimensions({
          ...dimensions,
          radius: Math.round(currentDimensions.width / 2),
          scale: Math.round((currentDimensions.scaleX + currentDimensions.scaleY) / 2 * 100)
        });
      } else if (element.type === 'ellipse') {
        setShapeType('ellipse');
        setDimensions({
          ...dimensions,
          radiusX: Math.round(currentDimensions.width / 2),
          radiusY: Math.round(currentDimensions.height / 2),
          scale: Math.round((currentDimensions.scaleX + currentDimensions.scaleY) / 2 * 100)
        });
      } else if (element.type === 'rect') {
        setShapeType('rect');
        setDimensions({
          ...dimensions,
          width: Math.round(currentDimensions.width),
          height: Math.round(currentDimensions.height),
          scale: Math.round((currentDimensions.scaleX + currentDimensions.scaleY) / 2 * 100)
        });
      } else if (element.type === 'triangle') {
        setShapeType('triangle');
        setDimensions({
          ...dimensions,
          width: Math.round(currentDimensions.width),
          height: Math.round(currentDimensions.height),
          scale: Math.round((currentDimensions.scaleX + currentDimensions.scaleY) / 2 * 100)
        });
      } else {
        setShapeType('other');
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleDimensionChange = (type, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setPendingDimensions(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const applyDimensions = () => {
    if (shapeType === 'circle') {
      const radius = pendingDimensions.radius ?? dimensions.radius;
      dimensionService.setDimensions(radius * 2, radius * 2);
    } else if (shapeType === 'ellipse') {
      const radiusX = pendingDimensions.radiusX ?? dimensions.radiusX;
      const radiusY = pendingDimensions.radiusY ?? dimensions.radiusY;
      dimensionService.setDimensions(radiusX * 2, radiusY * 2);
    } else if (shapeType === 'rect' || shapeType === 'triangle') {
      const width = pendingDimensions.width ?? dimensions.width;
      const height = pendingDimensions.height ?? dimensions.height;
      dimensionService.setDimensions(width, height);
    }

    if (pendingDimensions.scale) {
      dimensionService.setScale(pendingDimensions.scale / 100);
    }

    setPendingDimensions({});
  };

  return (
    <Card className="p-2 space-y-2 bg-gray-900 border-gray-700">
      {shapeType === 'circle' && (
        <div className="flex items-center gap-2">
          <Label className="text-xs text-gray-300 w-12">Radius</Label>
          <Input
            type="number"
            value={pendingDimensions.radius ?? dimensions.radius}
            onChange={(e) => handleDimensionChange('radius', e.target.value)}
            className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
          />
        </div>
      )}

      {shapeType === 'ellipse' && (
        <>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-300 w-12">Radius X</Label>
            <Input
              type="number"
              value={pendingDimensions.radiusX ?? dimensions.radiusX}
              onChange={(e) => handleDimensionChange('radiusX', e.target.value)}
              className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-300 w-12">Radius Y</Label>
            <Input
              type="number"
              value={pendingDimensions.radiusY ?? dimensions.radiusY}
              onChange={(e) => handleDimensionChange('radiusY', e.target.value)}
              className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
            />
          </div>
        </>
      )}

      {(shapeType === 'rect' || shapeType === 'triangle') && (
        <>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-300 w-12">Width</Label>
            <Input
              type="number"
              value={pendingDimensions.width ?? dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-300 w-12">Height</Label>
            <Input
              type="number"
              value={pendingDimensions.height ?? dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <Label className="text-xs text-gray-300 w-12">Scale</Label>
        <Input
          type="number"
          value={pendingDimensions.scale ?? dimensions.scale}
          onChange={(e) => handleDimensionChange('scale', e.target.value)}
          min="1"
          max="500"
          className="h-8 bg-gray-800 border-gray-700 text-gray-200 text-xs"
        />
      </div>

      <Button 
        onClick={applyDimensions}
        className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-xs"
      >
        Apply
      </Button>
    </Card>
  );
};
