export const textService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  addText(textValue) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule || !textValue) return;

    const textEle = new this.canvasService.fabricModule.Text(textValue, {
      left: 100,
      top: 100,
      fontSize: 40,
    });

    this.canvasService.canvas.add(textEle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addTextWithPosition(textObj) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule || !textObj) return;
    const textEle = new this.canvasService.fabricModule.Text(textObj.content, {
      left: textObj.position.x,
      top: textObj.position.y,
      fontSize: 40,
      width: textObj.position.width,
      height: textObj.position.height
    });
    this.canvasService.canvas.add(textEle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  }
};
