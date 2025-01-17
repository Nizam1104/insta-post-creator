export const opacityService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementOpacity(opacity) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject) return;
    
    // Handle both single elements and groups
    if (activeObject._objects) {
      // If it's a group, set opacity for all objects in the group
      activeObject._objects.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords();
      });
      activeObject.set('opacity', opacity);
      activeObject.setCoords();
    } else if (Array.isArray(activeObject)) {
      // If it's multiple selected elements
      activeObject.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords();
      });
    } else {
      // Single element
      activeObject.set('opacity', opacity);
      activeObject.setCoords();
    }
    
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  }
};
