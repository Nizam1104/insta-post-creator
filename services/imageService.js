export const imageService = {
  canvasService: null,

  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  async addImage(imageUrl) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule || !imageUrl) return;

    const img = await this.canvasService.fabricModule.Image.fromURL(imageUrl);
    img.set({
      left: 100,
      top: 100,
      angle: 0,
      scaleX: 0.3,
      scaleY: 0.3
    });

    this.canvasService.canvas.add(img);
    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  }
}
