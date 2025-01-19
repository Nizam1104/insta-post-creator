"use client"
import { drawingModeService } from "@/services/drawingModeService"
import { Button } from "../ui/button"
import { useState } from "react"
import { FaPencilAlt, FaBorderAll } from "react-icons/fa"

export default function DrawingModeConfig() {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [gridVisible, setGridVisible] = useState(false)

  const handleDrawingMode = () => {
    const newState = drawingModeService.toggleDrawingMode()
    setIsDrawingMode(newState)
  }

  const handleGridLines = () => {
    const newState = drawingModeService.toggleGridLines()
    setGridVisible(newState)
  }

  return (
    <div className="flex flex-col p-2 bg-gray-900 rounded-md space-y-2">
      <Button 
        size="sm" 
        onClick={handleDrawingMode}
        className={`flex items-center gap-2 ${
          isDrawingMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <FaPencilAlt />
        <span>{isDrawingMode ? 'Disable' : 'Enable'} Drawing</span>
      </Button>
      
      <Button 
        size="sm" 
        onClick={handleGridLines}
        className={`flex items-center gap-2 ${
          gridVisible ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <FaBorderAll />
        <span>Toggle Grid</span>
      </Button>
    </div>
  )
}
