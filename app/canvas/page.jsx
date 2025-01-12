import PostCanvas from "../../components/PostCanvas"
import TextEditor from "@/components/TextEditor"

export default function CanvasPage() {

  return (
    <div className="flex flex-col space-y-8">
      <TextEditor />
      <PostCanvas />
    </div>
  )
}
