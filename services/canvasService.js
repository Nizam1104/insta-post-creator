class CanvasService {
  canvas = null;
  fabricModule = null;

  initialize(canvas, fabricModule) {
    this.canvas = canvas;
    this.fabricModule = fabricModule;
  }

  setCanvasColor(color) {
    if (this.canvas) {
      this.canvas.backgroundColor = color;
      this.canvas.renderAll();
      localStorage.setItem('postCanvasBgColour', color);
    }
  }

  addRect() {
    if (!this.canvas || !this.fabricModule) return;

    const gradient = new this.fabricModule.Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
      colorStops: [
        { offset: 0, color: "red" },
        { offset: 0.5, color: "yellow" },
        { offset: 1, color: "green" },
      ],
    });

    const rect = new this.fabricModule.Rect({
      left: 200,
      top: 100,
      width: 100,
      height: 100,
      fill: gradient,
      angle: 0,
    });

    this.canvas.add(rect);
    this.canvas.renderAll();
  }

  addText(textValue) {
    if (!this.canvas || !this.fabricModule) return;
  }

  saveCanvas() {
    if (!this.canvas) return;
    const canvasJSON = this.canvas.toJSON();
    localStorage.setItem("savedCanvas", JSON.stringify(canvasJSON));
  }

  loadCanvas() {
    if (!this.canvas) return;
    const savedCanvas = localStorage.getItem("savedCanvas");
    if (savedCanvas) {
      this.canvas.loadFromJSON(JSON.parse(savedCanvas));
      setTimeout(() => {
        this.canvas.renderAll();
      }, 100);
    }
  }
}

export const canvasService = new CanvasService();
