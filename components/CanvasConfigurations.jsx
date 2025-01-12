"use client"

import SetCanvasColor from "./CanvasUtilities/SetCanvasColor"
import SetTextSize from "./TextUtilities/setTextSize"

export default function CanvasConfigurations() {
  return (
    <div className="flex flex-col space-y-2 text-white">
      <div>
        <SetCanvasColor />
        <SetTextSize />
      </div>
    </div>
  )
}
