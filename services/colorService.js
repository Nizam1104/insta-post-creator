import { toRGB } from "./utilFunctions";

export const colorService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementColor(colorCode) {
    if (!this.canvasService.selectedElement) return;
    const x = toRGB(colorCode);
    this.canvasService.selectedElement[0].set('fill', `rgb(${x?.r || 0}, ${x?.g || 0}, ${x?.b || 0})`);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setCanvasColor(color) {
    if (this.canvasService.canvas) {
      this.canvasService.canvas.backgroundColor = color;
      this.canvasService.canvas.renderAll();
      localStorage.setItem('postCanvasBgColour', color);
    }
    this.canvasService.saveCanvas();
  }
};
