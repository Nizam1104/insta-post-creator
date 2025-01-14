import { Button } from "../ui/button"
import { canvasService } from "@/services/canvasService"

export default function Testing() {
  const handleTesting  = () => {
    canvasService.addRect()
  }

  return (
    <div>
      <Button size="sm" onClick={handleTesting} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        add rect
      </Button>
    </div>
  )
}
