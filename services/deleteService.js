export const deleteService = {
  canvasService: null,

  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  deleteSelectedElement() {
    if (!this.canvasService?.selectedElement || !this.canvasService?.canvas) return;
    
    const selected = this.canvasService.selectedElement;
    
    // Handle both single elements and groups
    if (selected._objects) {
      // If it's a group, remove all objects in the group
      selected._objects.forEach(element => {
        this.canvasService.canvas.remove(element);
      });
      this.canvasService.canvas.remove(selected);
    } else if (Array.isArray(selected)) {
      // If it's multiple selected elements
      selected.forEach(element => {
        this.canvasService.removeElementFromCanvas(element);
      });
    } else {
      // Single element
      this.canvasService.removeElementFromCanvas(selected);
    }
    
    this.canvasService.canvas.discardActiveObject();
    this.canvasService.canvas.renderAll();
    this.canvasService.clearSelectedElement();
    this.canvasService.saveCanvas();
  }
}
