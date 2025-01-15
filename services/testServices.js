export const testServices = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  getAllSelectedElementsAsJson() {
    if (!this.canvasService?.canvas) return null;
    
    const selectedElements = this.canvasService.canvas.getActiveObjects();
    
    return selectedElements.map(element => ({
      type: element.type,
      content: element.text || '',
      position: {
        x: element.left,
        y: element.top,
        width: element.width,
        height: element.height
      },
      styles: {
        fontSize: element.fontSize,
        fill: element.fill,
        fontFamily: element.fontFamily
      }
    }));
  }
}
