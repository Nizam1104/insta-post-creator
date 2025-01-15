"use client"
import { useState } from "react"
import { canvasService } from "@/services/canvasService"
import { textService } from "@/services/textService"
import { testServices } from "@/services/testServices"

export default function AskAi() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const styleUsingAi = async function() {
    const objs = testServices.getAllSelectedElementsAsJson();
    if (!objs?.length) return;

    try {
      const res = await fetch('/api/enhanceStyle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objs)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const apiData = await res.json();
      
      // ... existing code ...
      if (apiData.status === 'success' && apiData.data) {
        // Apply enhanced styles to canvas elements
        apiData.data.forEach(enhancedElement => {
          const element = canvasService.canvas.getActiveObjects()
            .find(el => el.text && el.text.toLowerCase() === enhancedElement.content.toLowerCase());
          
          if (element) {
            // Parse shadow string into object
            const shadowParts = enhancedElement.styles.effects.shadow.split(' ');
            const shadowObject = {
              color: shadowParts[3],
              offsetX: parseInt(shadowParts[0]),
              offsetY: parseInt(shadowParts[1]),
              blur: parseInt(shadowParts[2])
            };
      
            // Parse padding and margin strings into arrays
            const paddingValues = enhancedElement.styles.layout.padding.split(' ').map(val => parseInt(val));
            const marginValues = enhancedElement.styles.layout.margin.split(' ').map(val => parseInt(val));
      
            // Apply styles with proper format
            element.set({
              fontSize: parseInt(enhancedElement.styles.typography.fontSize),
              fill: enhancedElement.styles.colors.text,
              fontFamily: enhancedElement.styles.typography.fontFamily.replace(/[']/g, ''),
              fontWeight: enhancedElement.styles.typography.fontWeight,
              lineHeight: parseFloat(enhancedElement.styles.typography.lineHeight),
              backgroundColor: enhancedElement.styles.colors.background,
              shadow: new canvasService.fabricModule.Shadow(shadowObject),
              padding: paddingValues,
              margin: marginValues
            });
      
            // Force object to update
            element.setCoords();
            canvasService.canvas.renderAll();
            canvasService.saveCanvas()
          }
        });
      }
    } catch (error) {
      console.error('Error enhancing styles:', error);
    }
  }

  const askAiForPost = async function() {
    try {
      const res = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      })
      
      const apiData = await res.json()
      // setResponse(data.content)
      // canvasService.loadFromElements(data.content.elements)


      apiData.data.elements.forEach(e => {
        textService.addTextWithPosition(e)
      })
    } catch (error) {
      console.error('Error calling API:', error)
    }
  }

  return (
    <div className="space-y-4 bg-gray-900 p-2 rounded-md">
      <div className="flex space-x-4 items-center">
      <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"
          placeholder="Enter your prompt..."
        />
        <button 
          onClick={askAiForPost}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ask AI
        </button>
        <button 
          onClick={styleUsingAi}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Style using ai
        </button>
      </div>
    </div>
  )
}
