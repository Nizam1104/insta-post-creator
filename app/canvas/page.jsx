import PostCanvas from "../../components/PostCanvas"
import UndoRedoCanvas from "@/components/CanvasUtilities/UndoRedo"

export default function CanvasPage() {

  return (
    <div className="flex flex-col space-y-8">
      {/* <TextEditor /> */}
      <UndoRedoCanvas />
      <PostCanvas />
    </div>
  )
}
