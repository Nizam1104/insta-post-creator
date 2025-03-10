"use client"
import { canvasService } from "@/services/canvasService";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { Button } from "../ui/button";
import { MdOutlineDelete } from "react-icons/md";
import { deleteService } from "@/services/deleteService";

export default function UndoRedoCanvas() {
  const handleUndo = () => {
    canvasService.undo();
  };

  const handleRedo = () => {
    canvasService.redo();
  };

  const handleDelete = () => {
    deleteService.deleteSelectedElement()
  }

  return (
    <div className="undo-redo-container flex space-x-2">
      <Button size="icon" onClick={handleUndo} className="h-8 w-8 bg-gray-200 text-slate-900 hover:bg-gray-300">
        <IoIosUndo className="h-4 w-4" />
      </Button>
      <Button size="icon" onClick={handleRedo} className="h-8 w-8 bg-gray-200 text-slate-900 hover:bg-gray-300">
        <IoIosRedo className="h-4 w-4" />
      </Button>
      <Button size="icon" onClick={handleDelete} className="h-8 w-8 bg-gray-200 text-slate-900 hover:bg-gray-300">
        <MdOutlineDelete className="h-4 w-4" />
      </Button>
    </div>
  );
}
