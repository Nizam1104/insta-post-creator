"use client";
import { shapesService } from "@/services/shapesService";
import { FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";
import { FaRegSquare } from "react-icons/fa";
import { Button } from "../ui/button";
import { CgSpinnerAlt } from "react-icons/cg";

export default function SetShapesOnCanvas() {

  const addRect = (hollow = false) => {
    shapesService.addRect(hollow)
  }

  const addCircle = (hollow = false) => {
    shapesService.addCircle(hollow)
  }

  const addTriangle = (hollow = false) => {
    shapesService.addTriangle(hollow)
  }

  const addSemiCircle = (hollow = false) => {
    shapesService.addSemiCircle(hollow)
  }

  const addArc = (hollow = false) => {
    shapesService.addArc(hollow)
  }

  const addTest = () => {
    shapesService.addBezierCurve()
  }

  const addBezierCurve = () => {
    shapesService.addBezierCurve()
  }

  const addPolyLine = () => {
    shapesService.addPolyLine()
  }

  const addEllipse = () => {
    shapesService.addEllipse()
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col space-y-4">
      <h3 className="text-base font-semibold text-gray-400">Add Shapes and curves</h3>
      
      {/* Solid Shapes */}
      <div className="flex flex-col space-y-4 flex-wrap">
        <h4 className="text-sm text-gray-500">Solid Shapes</h4>
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => addCircle()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegCircle className="w-6 h-6 text-purple-400" />
          </Button>
          <Button
            onClick={() => addSemiCircle()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <div className="w-6 h-3 bg-orange-400 rounded-t-full border border-black" />
          </Button>
          <Button
            onClick={() => addTriangle()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <IoTriangleOutline className="w-6 h-6 text-blue-400" />
          </Button>
          <Button
            onClick={() => addRect()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegSquare className="w-6 h-6 text-green-400" />
          </Button>
          <Button
            onClick={() => addArc()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <CgSpinnerAlt className="w-6 h-6 text-pink-300"/>
          </Button>
          <Button
            onClick={() => addPolyLine()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-xs font-semibold">PolyLine</span>
          </Button>

          <Button
            onClick={() => addBezierCurve()}
            variant="ghost"
            className="w-fit h-auto rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-xs font-semibold">Add multi point curve</span>
          </Button>

          <Button
            onClick={() => addEllipse()}
            variant="ghost"
            className="w-fit h-auto rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-xs font-semibold">Ellipse</span>
          </Button>

          <Button
            onClick={() => addTest()}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-xs font-semibold">Test</span>
          </Button>
        </div>
      </div>

      {/* Hollow Shapes */}
      <div className="flex flex-col space-y-4">
        <h4 className="text-sm text-gray-500">Hollow Shapes</h4>
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => addCircle(true)}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegCircle className="w-6 h-6 text-purple-400" />
          </Button>
          <Button
            onClick={() => addSemiCircle(true)}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <div className="w-6 h-3 bg-orange-400 rounded-t-full border border-black" />
          </Button>
          <Button
            onClick={() => addTriangle(true)}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <IoTriangleOutline className="w-6 h-6 text-blue-400" />
          </Button>
          <Button
            onClick={() => addRect(true)}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegSquare className="w-6 h-6 text-green-400" />
          </Button>
          <Button
            onClick={() => addArc(true)}
            variant="ghost"
            className="h-12 w-12 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <CgSpinnerAlt className="w-6 h-6 text-pink-300"/>
          </Button>
        </div>
      </div>
    </div>
  );
}
