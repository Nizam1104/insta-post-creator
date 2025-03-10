"use client";

import { textService } from "@/services/textService";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
export default function SetTextOnCanvas() {
  const [textValue, setTextValue] = useState("");

  const setTextToCanvas = () => {
    textService.addText(textValue)
  }

  return (
    <div className="bg-gray-900 rounded-md p-1">
      <div className="flex flex-col space-y-0.5">
        <h2 className="text-sm font-medium text-gray-400">Add text</h2>
        <div className="flex space-x-1">
          <Input
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
            size="sm"
            placeholder="Enter text..."
            className="h-8"
          />
          <Button 
            size="sm" 
            onClick={setTextToCanvas} 
            className="h-8 w-12 bg-gray-200 text-slate-900 text-xs font-semibold hover:bg-gray-300"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
