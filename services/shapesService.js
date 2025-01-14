export const shapesService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  addRect() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule) return;

    const gradient = new this.canvasService.fabricModule.Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
      colorStops: [
        { offset: 0, color: "red" },
        { offset: 0.5, color: "yellow" },
        { offset: 1, color: "green" },
      ],
    });

    const rect = new this.canvasService.fabricModule.Rect({
      left: 200,
      top: 100,
      width: 100,
      height: 100,
      fill: gradient,
      angle: 0,
    });

    this.canvasService.canvas.add(rect);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  }
};
