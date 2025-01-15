import { Button } from "../ui/button"
import { shapesService } from "@/services/shapesService"

export default function Testing() {
  const handleTesting  = () => {
    shapesService.addRect()
  }

  return (
    <div>
      <Button size="sm" onClick={handleTesting} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        add rect
      </Button>
    </div>
  )
}
