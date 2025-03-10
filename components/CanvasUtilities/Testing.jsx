import { Button } from "../ui/button"
import { canvasDownloadService } from "@/services/canvasDownloadService"

export default function Testing() {
  const handleTesting = () => canvasDownloadService.downloadCanvasAsPng()

  return (
    <div className="p-0">
      <Button 
        size="xs" 
        onClick={handleTesting} 
        className="bg-gray-200 text-slate-900 text-[10px] font-semibold hover:bg-gray-300 px-2 py-1"
      >
        download
      </Button>
    </div>
  )
}
