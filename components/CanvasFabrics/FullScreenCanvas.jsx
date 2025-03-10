"use client";
import { useEffect } from "react";
import { useFabric } from "@/hooks/useFabric";
import { fullScreenCanvasService } from "@/services/fullScreenCanvasService"
import { colorService } from "@/services/colorService";

const FullScreenCanvas = () => {
  const { canvas, fabricModule } = useFabric("fullPageCanvas", true);

  useEffect(() => {
    if (canvas && fabricModule) {
      fullScreenCanvasService.initialize(canvas, fabricModule);
      
      colorService.loadCanvasColor(true);
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
