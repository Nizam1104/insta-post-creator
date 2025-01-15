export const zIndexService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  bringForward() {
    const activeObject = this.canvasService.canvas.getActiveObject()
    if (activeObject) {
      this.canvasService.canvas.bringObjectForward(activeObject)
      this.canvasService.canvas.renderAll()
    }
  },

  sendBackward() {
    const activeObject = this.canvasService.canvas.getActiveObject()
    if (activeObject) {
      this.canvasService.canvas.sendObjectBackwards(activeObject)
      this.canvasService.canvas.renderAll()
    }
  },

  bringToFront() {
    const activeObject = this.canvasService.canvas.getActiveObject()
    this.canvasService.canvas.bringObjectToFront(activeObject)
    this.canvasService.canvas.renderAll()
  },

  sendToBack() {
    const activeObject = this.canvasService.canvas.getActiveObject()
    if (activeObject) {
      this.canvasService.canvas.sendObjectToBack(activeObject)
      this.canvasService.canvas.renderAll()
    }
  }
}
