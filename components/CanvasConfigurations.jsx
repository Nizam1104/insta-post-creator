"use client";

import SetCanvasColor from "./CanvasUtilities/SetCanvasColor";
import SetTextOnCanvas from "./CanvasUtilities/SetTextOnCanvas";
import SetElementColor from "./CanvasUtilities/SetElementColor";
import SetImageOnCanvas from "./CanvasUtilities/SetImageOnCanvas";
import SetElementShadow from "./CanvasUtilities/SetElementShadow";
import SetElementOpacity from "./CanvasUtilities/SetElementOpacity";
import SetShapesOnCanvas from "./CanvasUtilities/SetShapesOnCanvas";
import SetElementZIndex from "./CanvasUtilities/SetElementZIndex";
import CreateCodeScreenShot from "./Modals/CreateCodeScreenShot";
import SetCornerRadius from "./CanvasUtilities/SetCornerRadius";
import SetDimensions from "./CanvasUtilities/SetDimensions";
import DrawingModeConfig from "./CanvasUtilities/DrawingModeConfigs";

// import Testing from "./CanvasUtilities/Testing"

import { useRouter, usePathname } from "next/navigation";

export default function CanvasConfigurations() {
  const pathName = usePathname();
  const router = useRouter();

  function gotoPostCanvas() {
    router.push("/insta-post");
  }

  return (
    <div className="flex flex-col space-y-6 text-white">
      {pathName === "/canvas" && (
        <div>
          <button
            onClick={gotoPostCanvas}
            className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300 px-2 py-1 rounded-md"
          >
            mini canvas
          </button>
        </div>
      )}
      <SetCanvasColor />
      <SetTextOnCanvas />
      <SetShapesOnCanvas />
      <SetImageOnCanvas />
      <DrawingModeConfig />
      <SetElementZIndex />
      {/* <Testing /> */}
      <div className="flex flex-col space-y-6">
        <span className="font-semibold text-gray-400">Element properties</span>
        <SetElementColor />
        <SetDimensions />
        <SetElementOpacity />
        <SetCornerRadius />
        <SetElementShadow />
      </div>
      <details className="group">
        <summary className="flex items-center justify-between p-2 bg-gray-800 rounded-md cursor-pointer">
          <h3 className="font-semibold text-gray-400">Other utils</h3>
          <svg
            className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div className="mt-2 pl-4">
          <CreateCodeScreenShot />
        </div>
      </details>
    </div>
  );
}
