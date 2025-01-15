export const shadowService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementShadow(options) {
    if (!this.canvasService.selectedElement) return;
    
    const shadow = new this.canvasService.fabricModule.Shadow({
      color: options.color || 'rgba(0,0,0,0.5)',
      blur: options.blur || 10,
      offsetX: options.offsetX || 5,
      offsetY: options.offsetY || 5
    });

    // Handle both single elements and groups
    if (this.canvasService.selectedElement._objects) {
      // If it's a group, set shadow for all objects in the group
      this.canvasService.selectedElement._objects.forEach(element => {
        element.set('shadow', shadow);
      });
      this.canvasService.selectedElement.set('shadow', shadow);
    } else {
      // If it's multiple selected elements
      this.canvasService.selectedElement.forEach(element => {
        element.set('shadow', shadow);
      });
    }
    
    setTimeout(() => {
      this.canvasService.canvas.renderAll();
    }, 30)
    this.canvasService.saveCanvas();
  },

  removeElementShadow() {
    if (!this.canvasService.selectedElement) return;
    
    // Handle both single elements and groups
    if (this.canvasService.selectedElement._objects) {
      // If it's a group, remove shadow from all objects in the group
      this.canvasService.selectedElement._objects.forEach(element => {
        element.set('shadow', null);
      });
      this.canvasService.selectedElement.set('shadow', null);
    } else {
      // If it's multiple selected elements
      this.canvasService.selectedElement.forEach(element => {
        element.set('shadow', null);
      });
    }
  
    setTimeout(() => {
      this.canvasService.canvas.renderAll();
    }, 30)
    this.canvasService.saveCanvas();
  }
};
