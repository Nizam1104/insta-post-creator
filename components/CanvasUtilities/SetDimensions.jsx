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

      // Determine shape type and set appropriate dimensions
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

    // Apply scale if it was changed
    if (pendingDimensions.scale) {
      dimensionService.setScale(pendingDimensions.scale / 100);
    }

    setPendingDimensions({});
  };

  return (
    <Card className="p-4 space-y-4 bg-gray-900 border-gray-700">
      {shapeType === 'circle' && (
        <div className="space-y-2">
          <Label className="text-gray-300">Radius</Label>
          <Input
            type="number"
            value={pendingDimensions.radius ?? dimensions.radius}
            onChange={(e) => handleDimensionChange('radius', e.target.value)}
            className="bg-gray-800 border-gray-700 text-gray-200"
          />
        </div>
      )}

      {shapeType === 'ellipse' && (
        <>
          <div className="space-y-2">
            <Label className="text-gray-300">Radius X</Label>
            <Input
              type="number"
              value={pendingDimensions.radiusX ?? dimensions.radiusX}
              onChange={(e) => handleDimensionChange('radiusX', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Radius Y</Label>
            <Input
              type="number"
              value={pendingDimensions.radiusY ?? dimensions.radiusY}
              onChange={(e) => handleDimensionChange('radiusY', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
          </div>
        </>
      )}

      {(shapeType === 'rect' || shapeType === 'triangle') && (
        <>
          <div className="space-y-2">
            <Label className="text-gray-300">Width</Label>
            <Input
              type="number"
              value={pendingDimensions.width ?? dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Height</Label>
            <Input
              type="number"
              value={pendingDimensions.height ?? dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label className="text-gray-300">Scale (%)</Label>
        <Input
          type="number"
          value={pendingDimensions.scale ?? dimensions.scale}
          onChange={(e) => handleDimensionChange('scale', e.target.value)}
          min="1"
          max="500"
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>

      <Button 
        onClick={applyDimensions}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Apply Dimensions
      </Button>
    </Card>
  );
};
