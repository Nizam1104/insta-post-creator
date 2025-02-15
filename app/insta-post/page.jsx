import AskAi from "@/components/AskAi"
import PostCanvas from "@/components/CanvasFabrics/postCanvas"
import UndoRedoCanvas from "@/components/CanvasUtilities/UndoRedo"
import DownloadCanvasThings from "@/components/CanvasUtilities/DownloadCanvasThings"

export default function CanvasPage() {

  return (
    <div className="flex flex-col space-y-8">
      {/* <TextEditor /> */}
      <div className="flex space-x-4">
      <UndoRedoCanvas />
      <div className="flex flex-grow" />
      <DownloadCanvasThings />
      </div>
      <PostCanvas />
      <AskAi />
    </div>
  )
}
