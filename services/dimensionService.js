export const dimensionService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  setWidth(width) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || typeof width !== 'number') return;
    
    activeObject.set('width', width);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setHeight(height) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || typeof height !== 'number') return;
    
    activeObject.set('height', height);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setScale(scale) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || typeof scale !== 'number') return;
    
    activeObject.scale(scale);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setRotation(angle) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || typeof angle !== 'number') return;
    
    // Set origin to center before rotating
    activeObject.set({
      originX: 'center',
      originY: 'center'
    });
    
    activeObject.set('angle', angle);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setDimensions(width, height) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || typeof width !== 'number' || typeof height !== 'number') return;
    
    activeObject.set({
      width: width,
      height: height
    });
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  getDimensions() {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    console.log('active obj', activeObject)
    if (!activeObject) return null;
    
    return {
      width: activeObject.getScaledWidth(),
      height: activeObject.getScaledHeight(),
      scaleX: activeObject.scaleX,
      scaleY: activeObject.scaleY,
      angle: activeObject.angle
    };
  }
};
