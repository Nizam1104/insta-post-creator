import { Button } from "../ui/button"
import { shapesService } from "@/services/shapesService"
import { canvasDownloadService } from "@/services/canvasDownloadService"

export default function Testing() {
  const handleTesting  = () => {
    canvasDownloadService.downloadCanvasAsPng()
  }

  return (
    <div>
      <Button size="sm" onClick={handleTesting} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        download
      </Button>
    </div>
  )
}
