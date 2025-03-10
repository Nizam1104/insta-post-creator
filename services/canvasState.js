export const canvasState = {
  activeCanvasType: null,
  activeCanvas: null,

  isCanvasReady() {
    // Check if canvas exists and has been properly initialized
    return this.activeCanvas && 
           this.activeCanvas.canvas && 
           this.activeCanvas.fabricModule;
  },

  getCanvasBackgroundColor() {
    if (!this.isCanvasReady()) return '';
    return this.activeCanvas.getBackgroundColor();
  }
};
