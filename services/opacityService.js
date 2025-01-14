export const opacityService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementOpacity(opacity) {
    if (!this.canvasService?.selectedElement) return;
    
    // Handle both single elements and groups
    if (this.canvasService.selectedElement._objects) {
      // If it's a group, set opacity for all objects in the group
      this.canvasService.selectedElement._objects.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords(); // Add this line
      });
      this.canvasService.selectedElement.set('opacity', opacity);
      this.canvasService.selectedElement.setCoords();
    } else {
      // If it's multiple selected elements
      this.canvasService.selectedElement.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords(); // Add this line
      });
    }
    
    // Remove setTimeout and render immediately
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  }
};
