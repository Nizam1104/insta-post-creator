"use client";
import { useEffect } from "react";
import { useFabric } from "@/hooks/useFabric";
import { fullScreenCanvasService } from "@/services/fullScreenCanvasService"
import { colorService } from "@/services/colorService";

const FullScreenCanvas = () => {
  const { canvas, fabricModule } = useFabric("fullPageCanvas", true);

  console.log('canvas', canvas)
  console.log('fab module', fabricModule)

  useEffect(() => {
    if (canvas && fabricModule) {
      console.log('indie if')
      fullScreenCanvasService.initialize(canvas, fabricModule);
      
      const savedColor = localStorage.getItem('postCanvasBgColour');
      if (savedColor) {
        colorService.setCanvasColor(savedColor);
      }
    }

    return () => {
      if (canvas) {
        fullScreenCanvasService.saveCanvas();
      }
    };
  }, [canvas, fabricModule]);

  return (
    <div className="w-full h-full border border-gray-200 rounmd flex justify-center items-center">
      <canvas id="fullPageCanvas" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default FullScreenCanvas;
