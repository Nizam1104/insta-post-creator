import { useState, useEffect, useRef } from "react";

export const useFabric = (canvasId) => {
  const [canvas, setCanvas] = useState(null);
  const [fabricModule, setFabricModule] = useState(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized.current) {
      isInitialized.current = true;
      
      import('fabric').then((module) => {
        const { Canvas } = module;
        
        if (typeof Canvas !== 'function') {
          throw new Error('Fabric.js failed to load properly');
        }
        
        const fabricCanvas = new Canvas(canvasId, {
          width: 500,
          height: 500,
          backgroundColor: localStorage.getItem('postCanvasBgColour') || '#FFFFFF'
        });
        
        fabricCanvas.renderAll();
        setCanvas(fabricCanvas);
        setFabricModule(module);
      }).catch(err => {
        console.error('Error loading Fabric.js:', err);
      });

      return () => {
        if (canvas) {
          canvas.dispose();
          setCanvas(null);
          setFabricModule(null);
          isInitialized.current = false;
        }
      };
    }
  }, [canvasId]);

  return { canvas, fabricModule };
};
