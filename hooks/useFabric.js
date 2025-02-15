import { useState, useEffect, useRef } from "react";

export const useFabric = (canvasId, fullScreen = false) => {
  const [canvas, setCanvas] = useState(null);
  const [fabricModule, setFabricModule] = useState(null);
  const isInitialized = useRef(false);
  const resizeHandlerRef = useRef(null);

  useEffect(() => {
    let fabricCanvas = null;

    const initializeFabric = async () => {
      if (typeof window === "undefined" || isInitialized.current) return;

      try {
        // First, clean up any existing canvas with the same ID
        const existingCanvas = document.getElementById(canvasId);
        if (existingCanvas) {
          // Get the parent node before removing the canvas
          const parentNode = existingCanvas.parentNode;
          
          // Properly dispose of any existing Fabric instance
          if (existingCanvas.fabric) {
            existingCanvas.fabric.dispose();
          }
          
          // Remove the existing canvas
          existingCanvas.remove();
          
          // Create and append a fresh canvas
          const freshCanvas = document.createElement('canvas');
          freshCanvas.id = canvasId;
          parentNode.appendChild(freshCanvas);
        }

        const module = await import('fabric');
        const { Canvas } = module;

        if (typeof Canvas !== 'function') {
          throw new Error('Fabric.js failed to load properly');
        }

        const canvasOptions = {
          backgroundColor: localStorage.getItem('postCanvasBgColour') || '#FFFFFF',
          selection: true,
          preserveObjectStacking: true,
          width: fullScreen ? window.innerWidth : 500,
          height: fullScreen ? window.innerHeight : 500,
          enablePointerEvents: fullScreen
        };

        fabricCanvas = new Canvas(canvasId, canvasOptions);

        if (fullScreen) {
          // Add zoom functionality
          fabricCanvas.on('mouse:wheel', function(opt) {
            const delta = opt.e.deltaY;
            let zoom = fabricCanvas.getZoom();
            zoom *= 0.999 ** delta;
            zoom = Math.min(Math.max(zoom, 0.01), 20);
            fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
          });

          // Handle window resize
          resizeHandlerRef.current = () => {
            fabricCanvas.setDimensions({
              width: window.innerWidth,
              height: window.innerHeight
            });
            fabricCanvas.renderAll();
          };

          window.addEventListener('resize', resizeHandlerRef.current);
        }

        fabricCanvas.renderAll();
        isInitialized.current = true;
        setCanvas(fabricCanvas);
        setFabricModule(module);
      } catch (err) {
        console.error('Error loading Fabric.js:', err);
      }
    };

    initializeFabric();

    // Cleanup function
    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
      
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      
      setCanvas(null);
      setFabricModule(null);
      isInitialized.current = false;
    };
  }, [canvasId, fullScreen]);

  return { canvas, fabricModule };
};
