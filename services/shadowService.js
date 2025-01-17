export const shadowService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setElementShadow(options) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject) return;
    
    const shadow = new this.canvasService.fabricModule.Shadow({
      color: options.color || 'rgba(0,0,0,0.5)',
      blur: options.blur || 10,
      offsetX: options.offsetX || 5,
      offsetY: options.offsetY || 5
    });

    // Handle both single elements and groups
    if (activeObject._objects) {
      // If it's a group, set shadow for all objects in the group
      activeObject._objects.forEach(element => {
        element.set('shadow', shadow);
      });
      activeObject.set('shadow', shadow);
    } else if (Array.isArray(activeObject)) {
      // If it's multiple selected elements
      activeObject.forEach(element => {
        element.set('shadow', shadow);
      });
    } else {
      // Single element
      activeObject.set('shadow', shadow);
    }
    
    setTimeout(() => {
      this.canvasService.canvas.renderAll();
    }, 30)
    this.canvasService.saveCanvas();
  },

  removeElementShadow() {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject) return;
    
    // Handle both single elements and groups
    if (activeObject._objects) {
      // If it's a group, remove shadow from all objects in the group
      activeObject._objects.forEach(element => {
        element.set('shadow', null);
      });
      activeObject.set('shadow', null);
    } else if (Array.isArray(activeObject)) {
      // If it's multiple selected elements
      activeObject.forEach(element => {
        element.set('shadow', null);
      });
    } else {
      // Single element
      activeObject.set('shadow', null);
    }
  
    setTimeout(() => {
      this.canvasService.canvas.renderAll();
    }, 30)
    this.canvasService.saveCanvas();
  }
};
