import { toRGB } from "./utilFunctions";

export const colorService = {
  canvasService: null,

  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  loadCanvasColor(fullScreen) {
    const storageKey = fullScreen
      ? "fullScreenCanvasBgColor"
      : "postCanvasBgColour";
    const color = localStorage.getItem(storageKey);

    if (color) {
      try {
        // Handle both string colors and gradient objects
        const parsedColor = JSON.parse(color);
        this.setCanvasColor(
          typeof parsedColor === "object" ? parsedColor : color
        );
      } catch (e) {
        this.setCanvasColor(color);
      }
    }
  },

  setElementColor(colorCode) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject) return;

    // Get current fill to check if it's a gradient
    const currentFill = activeObject.get("fill");
    const isGradient = currentFill && currentFill.colorStops;

    // Direct hex color support
    if (colorCode?.startsWith("#")) {
      activeObject.set("fill", colorCode);
    } else {
      const x = toRGB(colorCode);
      activeObject.set("fill", `rgb(${x?.r || 0}, ${x?.g || 0}, ${x?.b || 0})`);
    }

    if (isGradient) {
      activeObject.set("gradientAngle", null);
      activeObject.set("gradientCoords", null);
    }

    this.canvasService.saveCanvas();
    this.canvasService.canvas.renderAll();
  },

  setCanvasColor(color) {
    if (!this.canvasService?.canvas) return;

    if (typeof color === "string") {
      // Handle solid color
      this.canvasService.canvas.backgroundColor = color;
      // Remove localStorage.setItem("postCanvasBgColour", color);
    } else if (typeof color === "object" && color.colorStops) {
      // Handle gradient
      const gradient = new this.canvasService.fabricModule.Gradient({
        type: color.type || "linear",
        coords: color.coords || {
          x1: 0,
          y1: 0,
          x2: this.canvasService.canvas.width,
          y2: this.canvasService.canvas.height,
        },
        colorStops: color.colorStops,
      });
      this.canvasService.canvas.backgroundColor = gradient;
    }

    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  setGradient(opts) {
    const activeObject = this.canvasService?.canvas?.getActiveObject();
    if (!activeObject || !this.canvasService?.fabricModule) return;
    if (!opts || typeof opts !== "object") return;
    if (!opts.type || !["linear", "radial"].includes(opts.type)) return;
    if (!opts.coords || typeof opts.coords !== "object") return;
    if (!opts.colorStops || !Array.isArray(opts.colorStops)) return;
    if (opts.colorStops.length < 2) return;

    // Get current fill to check if it's already a gradient
    const currentFill = activeObject.get("fill");
    const isCurrentGradient = currentFill && currentFill.colorStops;

    const defaultCoords = {
      linear: {
        x1: 0,
        y1: 0,
        x2: activeObject.width,
        y2: activeObject.height,
      },
      radial: {
        x1: activeObject.width / 2,
        y1: activeObject.height / 2,
        r1: 0,
        x2: activeObject.width / 2,
        y2: activeObject.height / 2,
        r2: Math.max(activeObject.width, activeObject.height) / 2,
      },
    };

    if (opts.type === "radial") {
      if (!opts.coords.r1 && opts.coords.r1 !== 0) {
        opts.coords.r1 = 0;
      }
      if (!opts.coords.r2) {
        opts.coords.r2 = Math.max(activeObject.width, activeObject.height) / 2;
      }
    }

    // Use provided colorStops directly if they exist
    const colorStops = opts.colorStops;

    const gradient = new this.canvasService.fabricModule.Gradient({
      type: opts.type,
      coords: opts.coords,
      colorStops: colorStops,
    });

    activeObject.set("fill", gradient);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },
};
