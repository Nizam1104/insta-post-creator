"use client";
import { useEffect } from "react";
import { useFabric } from "@/hooks/useFabric";
import { canvasService } from "@/services/canvasService";

const PostCanvas = () => {
  const { canvas, fabricModule } = useFabric("canvasContainer");

  useEffect(() => {
    if (canvas && fabricModule) {
      canvasService.initialize(canvas, fabricModule);
      
      // colorService.loadCanvasColor(false);
    }

    return () => {
      if (canvas) {
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
