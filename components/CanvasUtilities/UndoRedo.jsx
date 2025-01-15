"use client"
import { canvasService } from "@/services/canvasService";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { Button } from "../ui/button";
import { MdOutlineDelete } from "react-icons/md";

export default function UndoRedoCanvas() {
  const handleUndo = () => {
    canvasService.undo();
  };

  const handleRedo = () => {
    canvasService.redo();
  };

  const handleDelete = () => {
    canvasService.deleteSelectedElement()
  }

  return (
    <div className="undo-redo-container flex space-x-4">
      <Button size="sm" onClick={handleUndo} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        <span>Undo</span>
        <IoIosUndo />
      </Button>
      <Button size="sm" onClick={handleRedo} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        <span>Redo</span>
        <IoIosRedo />
      </Button>
      <Button size="sm" onClick={handleDelete} className="bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300">
        Delete
        <MdOutlineDelete />
      </Button>
    </div>
  );
}
