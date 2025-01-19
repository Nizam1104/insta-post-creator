"use client"
import { Button } from "../ui/button";
import { IoIosDownload } from "react-icons/io";
import { canvasDownloadService } from "@/services/canvasDownloadService";

export default function DownloadCanvasThings() {

  const downloadCanvas = () => {
    canvasDownloadService.downloadCanvasAsPng()
  }
  return (
    <div>
      <Button
        onClick={downloadCanvas}
        size="sm"
        className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
      >
        <span>Download</span>
        <IoIosDownload />
      </Button>
    </div>
  );
}
