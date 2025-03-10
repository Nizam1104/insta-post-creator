"use client";
import { shapesService } from "@/services/shapesService";
import { FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";
import { FaRegSquare } from "react-icons/fa";
import { Button } from "../ui/button";
import { CgSpinnerAlt } from "react-icons/cg";

export default function SetShapesOnCanvas() {
  const addRect = (hollow = false) => {
    shapesService.addRect(hollow);
  };

  const addCircle = (hollow = false) => {
    shapesService.addCircle(hollow);
  };

  const addTriangle = (hollow = false) => {
    shapesService.addTriangle(hollow);
  };

  const addSemiCircle = (hollow = false) => {
    shapesService.addSemiCircle(hollow);
  };

  const addArc = (hollow = false) => {
    shapesService.addArc(hollow);
  };

  const addTest = () => {
    shapesService.addBezierCurve();
  };

  const addBezierCurve = () => {
    shapesService.addBezierCurve();
  };

  const addPolyLine = () => {
    shapesService.addPolyLine();
  };

  const addEllipse = () => {
    shapesService.addEllipse();
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-xl border border-gray-800 flex flex-col space-y-2">
      <h3 className="text-sm font-semibold text-gray-400">Add Shapes</h3>

      {/* Solid Shapes */}
      <div className="flex flex-col space-y-2">
        {/* <h4 className="text-xs text-gray-500">Solid</h4> */}
        <div className="flex gap-1.5 flex-wrap">
          <Button
            onClick={() => addCircle()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegCircle className="w-4 h-4 text-purple-400" />
          </Button>
          <Button
            onClick={() => addSemiCircle()}
            variant="ghost"
            className="h-8 w-14 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <div className="w-8 h-4 bg-orange-400 rounded-t-full border border-orange-400" />
          </Button>
          <Button
            onClick={() => addTriangle()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <IoTriangleOutline className="w-4 h-4 text-blue-400" />
          </Button>
          <Button
            onClick={() => addRect()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegSquare className="w-4 h-4 text-green-400" />
          </Button>
          <Button
            onClick={() => addArc()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <CgSpinnerAlt className="w-4 h-4 text-pink-300" />
          </Button>
          <Button
            onClick={() => addPolyLine()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-[10px] font-semibold">
              Poly
            </span>
          </Button>
          <Button
            onClick={() => addBezierCurve()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-[10px] font-semibold">
              Curve
            </span>
          </Button>
          {/* <Button
            onClick={() => addEllipse()}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-400 text-[10px] font-semibold">Ellipse</span>
          </Button> */}
        </div>
      </div>

      {/* Hollow Shapes */}
      {/* <div className="flex flex-col space-y-2">
        <h4 className="text-xs text-gray-500">Hollow</h4>
        <div className="flex gap-1.5 flex-wrap">
          <Button
            onClick={() => addCircle(true)}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegCircle className="w-4 h-4 text-purple-400" />
          </Button>
          <Button
            onClick={() => addSemiCircle(true)}
            variant="ghost"
            className="h-8 w-14 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <div className="w-8 h-4 bg-orange-400 rounded-t-full border border-orange-400" />
          </Button>
          <Button
            onClick={() => addTriangle(true)}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <IoTriangleOutline className="w-4 h-4 text-blue-400" />
          </Button>
          <Button
            onClick={() => addRect(true)}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <FaRegSquare className="w-4 h-4 text-green-400" />
          </Button>
          <Button
            onClick={() => addArc(true)}
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
          >
            <CgSpinnerAlt className="w-4 h-4 text-pink-300"/>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
