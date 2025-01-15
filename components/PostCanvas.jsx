"use client";
import { useEffect } from "react";
import { useFabric } from "@/hooks/useFabric";
import { canvasService } from "@/services/canvasService";
import { colorService } from "@/services/colorService";

const PostCanvas = () => {
  const { canvas, fabricModule } = useFabric("canvasContainer");

  useEffect(() => {
    if (canvas && fabricModule) {
      canvasService.initialize(canvas, fabricModule);
      
      const savedColor = localStorage.getItem('postCanvasBgColour');
      if (savedColor) {
        colorService.setCanvasColor(savedColor);
      }
    }

    return () => {
      if (canvas) {
        canvasService.clearSelectedElement();
        canvasService.saveCanvas();
      }
    };
  }, [canvas, fabricModule]);

  return (
    <div className="w-[500px] h-[500px] border border-gray-200 rounmd flex justify-center items-center">
      <canvas id="canvasContainer" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default PostCanvas;
