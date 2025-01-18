export const shapesService = {
  canvasService: null,

  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  addEllipse(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const ellipse = new this.canvasService.fabricModule.Ellipse({
      left: 200,
      top: 100,
      rx: 75,  // horizontal radius
      ry: 50,  // vertical radius
      fill: hollow ? "transparent" : "black",
      stroke: "black",
      strokeWidth: 0.5,
      angle: 0,
    });

    this.canvasService.canvas.add(ellipse);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addRect(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const rect = new this.canvasService.fabricModule.Rect({
      left: 200,
      top: 100,
      width: 100,
      height: 100,
      fill: hollow ? "transparent" : "black",
      stroke: "black",
      strokeWidth: 0.5,
      angle: 0,
    });

    this.canvasService.canvas.add(rect);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addCircle(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const circle = new this.canvasService.fabricModule.Circle({
      left: 200,
      top: 100,
      radius: 50,
      fill: hollow ? "transparent" : "black",
      stroke: "black",
      strokeWidth: 0.5,
    });

    this.canvasService.canvas.add(circle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addSemiCircle(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const semiCircle = new this.canvasService.fabricModule.Path(
      "M 100 100 a 50 50 0 0 1 100 0",
      {
        left: 200,
        top: 100,
        fill: hollow ? "transparent" : "black",
        stroke: "black",
        strokeWidth: 0.5,
      }
    );

    this.canvasService.canvas.add(semiCircle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addTriangle(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const triangle = new this.canvasService.fabricModule.Triangle({
      left: 200,
      top: 100,
      width: 100,
      height: 100,
      fill: hollow ? "transparent" : "black",
      stroke: "black",
      strokeWidth: 0.5,
    });

    this.canvasService.canvas.add(triangle);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addLine(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const line = new this.canvasService.fabricModule.Line([50, 100, 250, 100], {
      stroke: "black",
      strokeWidth: 0.5,
      fill: hollow ? "transparent" : "black",
    });

    this.canvasService.canvas.add(line);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addArc(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const arc = new this.canvasService.fabricModule.Path(
      "M 100 100 a 50 50 0 1 0 100 0",
      {
        left: 200,
        top: 100,
        fill: hollow ? "transparent" : "black",
        stroke: "black",
        strokeWidth: 0.5,
      }
    );

    this.canvasService.canvas.add(arc);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addLine() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const line = new this.canvasService.fabricModule.Line([50, 100, 250, 100], {
      stroke: "black",
      strokeWidth: 0.5,
    });

    this.canvasService.canvas.add(line);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addEllipse(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const ellipse = new this.canvasService.fabricModule.Ellipse({
      rx: 100,
      ry: 50,
      left: 200,
      top: 100,
      fill: hollow ? "transparent" : "black",
      stroke: "black",
      strokeWidth: 0.5,
    });

    this.canvasService.canvas.add(ellipse);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addPath(hollow = false) {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;

    const path = new this.canvasService.fabricModule.Path(
      "M 0 0 L 100 100 L 200 50 Z",
      {
        stroke: "black",
        strokeWidth: 0.5,
        fill: hollow ? "transparent" : "black",
        selectable: true,
        hasControls: true,
        hasBorders: true,
      }
    );

    this.canvasService.canvas.add(path);
    this.canvasService.canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  addPolyLine() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;
  
    const points = [];
    let isDrawing = false;
    let tempLine = null;
  
    // Mouse down handler
    const handleMouseDown = (options) => {
      isDrawing = true;
      const pointer = this.canvasService.canvas.getPointer(options.e);
      points.push(pointer);
  
      // Draw temporary line if there are at least two points
      if (points.length > 1) {
        tempLine = new this.canvasService.fabricModule.Line(
          [
            points[points.length - 2].x,
            points[points.length - 2].y,
            pointer.x,
            pointer.y,
          ],
          {
            stroke: "black",
            strokeWidth: 0.5,
            selectable: false,
            evented: false, // Ensure the line is not interactive
          }
        );
        this.canvasService.canvas.add(tempLine);
      }
    };
  
    // Mouse move handler
    const handleMouseMove = (options) => {
      if (!isDrawing || points.length < 1) return;
  
      const pointer = this.canvasService.canvas.getPointer(options.e);
  
      if (tempLine) {
        // Update the end point of the line
        tempLine.set({
          x2: pointer.x,
          y2: pointer.y
        });
        this.canvasService.canvas.requestRenderAll(); // Use requestRenderAll for better performance
      }
    };
  
    // Mouse up handler
    const handleMouseUp = () => {
      isDrawing = false;
      // if (tempLine) {
      //   this.canvasService.canvas.remove(tempLine);
      //   tempLine = null;
      // }
    };
  
    // Double click handler to finalize curve
    const handleDoubleClick = () => {
      if (points.length < 2) return;
  
      // Create path from points
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathString += ` L ${points[i].x} ${points[i].y}`;
      }
  
      const curve = new this.canvasService.fabricModule.Path(pathString, {
        stroke: "black",
        strokeWidth: 0.5,
        fill: "transparent",
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });

      this.canvasService.canvas.getObjects().forEach(obj => {
        if (obj.selectable === false && obj.evented === false) {
          this.canvasService.canvas.remove(obj);
        }
      });
  
      // Clear points and event listeners
      points.length = 0;
      this.canvasService.canvas.off("mouse:down", handleMouseDown);
      this.canvasService.canvas.off("mouse:move", handleMouseMove);
      this.canvasService.canvas.off("mouse:up", handleMouseUp);
      this.canvasService.canvas.off("mouse:dblclick", handleDoubleClick);
  
      // Add final curve to canvas
      this.canvasService.canvas.add(curve);
      this.canvasService.canvas.requestRenderAll();
      this.canvasService.saveCanvas();
    };
  
    // Set up event listeners
    this.canvasService.canvas.on("mouse:down", handleMouseDown);
    this.canvasService.canvas.on("mouse:move", handleMouseMove);
    this.canvasService.canvas.on("mouse:up", handleMouseUp);
    this.canvasService.canvas.on("mouse:dblclick", handleDoubleClick);
  },

  addBezierCurve() {
    if (!this.canvasService?.canvas || !this.canvasService?.fabricModule)
      return;
  
    const points = [];
    let isDrawing = false;
    let tempLine = null;
    let previewCurve = null;
    let controlPoints = [];
    let guideLine = null; // New guide line for cursor movement

    // Helper function to create preview curve
    const updatePreviewCurve = () => {
      if (points.length < 1) return;
  
      // Remove old preview curve if it exists
      if (previewCurve) {
        this.canvasService.canvas.remove(previewCurve);
      }
  
      // Create path string for current points
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i += 3) {
        if (points[i + 2]) {
          pathString += ` C ${points[i].x} ${points[i].y}, ${points[i + 1].x} ${points[i + 1].y}, ${points[i + 2].x} ${points[i + 2].y}`;
        }
      }
  
      // Create and add preview curve
      previewCurve = new this.canvasService.fabricModule.Path(pathString, {
        stroke: "blue",
        strokeWidth: 0.5,
        fill: "transparent",
        selectable: false,
        evented: false
      });
      this.canvasService.canvas.add(previewCurve);
    };
  
    // Mouse down handler
    const handleMouseDown = (options) => {
      isDrawing = true;
      const pointer = this.canvasService.canvas.getPointer(options.e);
  
      // Remove any existing guide line
      if (guideLine) {
        this.canvasService.canvas.remove(guideLine);
        guideLine = null;
      }
  
      if (points.length % 3 === 0) {
        // Main point
        points.push(pointer);
        // Create visual marker for main point
        const mainPoint = new this.canvasService.fabricModule.Circle({
          left: pointer.x - 4,
          top: pointer.y - 4,
          radius: 4,
          fill: 'red',
          selectable: false,
          evented: false
        });
        this.canvasService.canvas.add(mainPoint);
      } else {
        // Control point
        controlPoints.push(pointer);
        points.push(pointer);
        // Create visual marker for control point
        const controlPoint = new this.canvasService.fabricModule.Circle({
          left: pointer.x - 3,
          top: pointer.y - 3,
          radius: 3,
          fill: 'green',
          selectable: false,
          evented: false
        });
        this.canvasService.canvas.add(controlPoint);
      }
  
      // Create or update temporary guide line
      if (tempLine) {
        this.canvasService.canvas.remove(tempLine);
      }
      if (points.length > 0) {
        tempLine = new this.canvasService.fabricModule.Line(
          [
            points[points.length - 1].x,
            points[points.length - 1].y,
            pointer.x,
            pointer.y,
          ],
          {
            stroke: "gray",
            strokeWidth: 1,
            selectable: false,
            evented: false,
            dashArray: [5, 5]
          }
        );
        this.canvasService.canvas.add(tempLine);
      }
  
      updatePreviewCurve();
      this.canvasService.canvas.requestRenderAll();
    };
  
    // Mouse move handler
    const handleMouseMove = (options) => {
      const pointer = this.canvasService.canvas.getPointer(options.e);
      
      // Always show guide line from last point to cursor
      if (points.length > 0) {
        if (!guideLine) {
          guideLine = new this.canvasService.fabricModule.Line(
            [
              points[points.length - 1].x,
              points[points.length - 1].y,
              pointer.x,
              pointer.y,
            ],
            {
              stroke: "rgba(0,0,0,0.3)",
              strokeWidth: 1,
              selectable: false,
              evented: false,
              dashArray: [3, 3]
            }
          );
          this.canvasService.canvas.add(guideLine);
        } else {
          guideLine.set({
            x2: pointer.x,
            y2: pointer.y
          });
        }
      }

      if (!isDrawing || points.length < 1) return;
  
      if (tempLine) {
        // Update temporary guide line
        tempLine.set({
          x2: pointer.x,
          y2: pointer.y
        });
      }
  
      this.canvasService.canvas.requestRenderAll();
    };
  
    // Mouse up handler
    const handleMouseUp = () => {
      isDrawing = false;
    };
  
    // Double click handler to finalize curve
    const handleDoubleClick = () => {
      if (points.length < 4) return;
  
      // Create final bezier curve
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i += 3) {
        if (points[i + 2]) {
          pathString += ` C ${points[i].x} ${points[i].y}, ${points[i + 1].x} ${points[i + 1].y}, ${points[i + 2].x} ${points[i + 2].y}`;
        }
      }
  
      const curve = new this.canvasService.fabricModule.Path(pathString, {
        stroke: "black",
        strokeWidth: 0.5,
        fill: "transparent",
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
  
      // Clean up temporary elements
      this.canvasService.canvas.getObjects().forEach(obj => {
        if (obj.selectable === false && obj.evented === false) {
          this.canvasService.canvas.remove(obj);
        }
      });
  
      // Clear points and event listeners
      points.length = 0;
      controlPoints.length = 0;
      this.canvasService.canvas.off("mouse:down", handleMouseDown);
      this.canvasService.canvas.off("mouse:move", handleMouseMove);
      this.canvasService.canvas.off("mouse:up", handleMouseUp);
      this.canvasService.canvas.off("mouse:dblclick", handleDoubleClick);
  
      // Add final curve to canvas
      this.canvasService.canvas.add(curve);
      this.canvasService.canvas.requestRenderAll();
      this.canvasService.saveCanvas();
    };
  
    // Set up event listeners
    this.canvasService.canvas.on("mouse:down", handleMouseDown);
    this.canvasService.canvas.on("mouse:move", handleMouseMove);
    this.canvasService.canvas.on("mouse:up", handleMouseUp);
    this.canvasService.canvas.on("mouse:dblclick", handleDoubleClick);
  }
};
