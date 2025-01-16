import { toRGB } from "./utilFunctions";

export const colorService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementColor(colorCode) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject) return;
    
    const x = toRGB(colorCode);
    activeObject.set('fill', `rgb(${x?.r || 0}, ${x?.g || 0}, ${x?.b || 0})`);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setCanvasColor(color) {
    if (this.canvasService?.canvas) {
      this.canvasService.canvas.backgroundColor = color;
      this.canvasService.canvas.renderAll();
      localStorage.setItem('postCanvasBgColour', color);
    }
    this.canvasService.saveCanvas();
  }
};

/*
 */