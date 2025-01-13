import { useState, useEffect } from "react";

export const useFabric = (canvasId) => {
  const [canvas, setCanvas] = useState(null);
  const [fabricModule, setFabricModule] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      
      import('fabric').then((module) => {
        const { Canvas } = module;
        
        if (typeof Canvas !== 'function') {
          throw new Error('Fabric.js failed to load properly');
        }
        
        const fabricCanvas = new Canvas(canvasId, {
          width: 500,
          height: 500,
          backgroundColor: 'red'
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
        }
      };
    }
  }, [canvasId]);

  return { canvas, fabricModule };
};
