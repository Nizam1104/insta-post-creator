"use client"

import SetCanvasColor from "./CanvasUtilities/SetCanvasColor"
import SetTextOnCanvas from "./CanvasUtilities/SetTextOnCanvas"
import SetElementColor from "./CanvasUtilities/SetElementColor"
import SetImageOnCanvas from "./CanvasUtilities/SetImageOnCanvas"
import SetElementShadow from "./CanvasUtilities/SetElementShadow"
import SetElementOpacity from "./CanvasUtilities/SetElementOpacity"

import Testing from "./CanvasUtilities/Testing"

export default function CanvasConfigurations() {
  return (
    <div className="flex flex-col space-y-6 text-white">
      <SetCanvasColor />
      <SetTextOnCanvas />
      <SetImageOnCanvas />
      <Testing />
      <div className="flex flex-col space-y-6">
        <span className="font-semibold text-gray-400">Element properties</span>
        <SetElementColor />
        <SetElementOpacity />
        <SetElementShadow />
      </div>
    </div>
  )
}
