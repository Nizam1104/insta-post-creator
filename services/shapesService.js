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
  },

  addCircle() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule) return;

    const circle = new this.canvasService.fabricModule.Circle({
      left: 200,
      top: 100,
      radius: 50,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvasService.canvas.add(circle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addSemiCircle() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule) return;

    const semiCircle = new this.canvasService.fabricModule.Path('M 100 100 a 50 50 0 0 1 100 0', {
      left: 200,
      top: 100,
      fill: 'orange',
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvasService.canvas.add(semiCircle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addTriangle() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule) return;

    const triangle = new this.canvasService.fabricModule.Triangle({
      left: 200,
      top: 100,
      width: 100,
      height: 100,
      fill: 'purple',
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvasService.canvas.add(triangle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addLine() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule) return;

    const line = new this.canvasService.fabricModule.Line([50, 100, 250, 100], {
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvasService.canvas.add(line);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  }
};
