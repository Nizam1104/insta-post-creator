"use client";
import { shapesService } from "@/services/shapesService";
import { FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";
import { FaRegSquare } from "react-icons/fa";
import { Button } from "../ui/button";

export default function SetShapesOnCanvas() {

  const addRect = () => {
    shapesService.addRect()
  }

  const addCircle = () => {
    shapesService.addCircle()
  }

  const addTriangle = () => {
    shapesService.addTriangle()
  }

  const addSemiCircle = () => {
    shapesService.addSemiCircle()
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col space-y-4">
      <h3 className="text-base font-semibold text-gray-400">Add Shapes</h3>
      <div className="flex gap-3">
        <Button
          onClick={addCircle}
          variant="ghost"
          className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
        >
          <FaRegCircle className="w-6 h-6 text-purple-400" />
        </Button>
        <Button
          onClick={addSemiCircle}
          variant="ghost"
          className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
        >
          <div className="w-6 h-3 bg-orange-400 rounded-t-full border border-black" />
        </Button>
        <Button
          onClick={addTriangle}
          variant="ghost"
          className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
        >
          <IoTriangleOutline className="w-6 h-6 text-blue-400" />
        </Button>
        <Button
          onClick={addRect}
          variant="ghost"
          className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
        >
          <FaRegSquare className="w-6 h-6 text-green-400" />
        </Button>
      </div>
    </div>
  );
}
