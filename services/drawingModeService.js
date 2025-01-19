export const drawingModeService = {
  canvasService: null,

  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  toggleDrawingMode() {
    if (!this.canvasService.canvas) return;

    const canvas = this.canvasService.canvas;
    const isDrawingMode = canvas.isDrawingMode;

    // Toggle drawing mode
    canvas.isDrawingMode = !isDrawingMode;

    if (canvas.isDrawingMode) {
      // Set brush properties when entering drawing mode
      canvas.freeDrawingBrush = new this.canvasService.fabricModule.PencilBrush(
        canvas
      );
      canvas.freeDrawingBrush.color = "#000000"; // Set default color
      canvas.freeDrawingBrush.width = 2; // Set default width

      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else {
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "move";
    }

    console.log(canvas);

    // Return new state
    return canvas.isDrawingMode;
  },

  toggleGridLines() {
    if (!this.canvasService.canvas) return false;
    const canvas = this.canvasService.canvas;
    const fabricModule = this.canvasService.fabricModule;
  
    // First, ensure Line objects will include 'id' in serialization
    if (!fabricModule.Line.prototype.includeDefaultValues) {
      fabricModule.Line.prototype.includeDefaultValues = {};
    }
    fabricModule.Line.prototype.includeDefaultValues.id = true;
  
    // Add id to the stateProperties to ensure proper serialization
    if (!fabricModule.Line.prototype.stateProperties) {
      fabricModule.Line.prototype.stateProperties = [];
    }
    if (!fabricModule.Line.prototype.stateProperties.includes('id')) {
      fabricModule.Line.prototype.stateProperties.push('id');
    }
  
    // Find existing grid lines
    const gridLines = canvas.getObjects().filter((obj) => {
      return obj instanceof fabricModule.Line && obj.id && (
        obj.id.includes("vertical_grid_line_") ||
        obj.id.includes("horizontal_grid_line_")
      );
    });
  
    if (gridLines.length > 0) {
      // Remove existing grid lines
      gridLines.forEach((line) => {
        canvas.remove(line);
      });
      canvas.requestRenderAll();
      return false;
    } else {
      // Create new grid lines
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      const gridSize = 50;
  
      // Create vertical lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new fabricModule.Line([i, 0, i, height], {
          stroke: "#000",
          selectable: false,
          evented: false,
          name: "gridLines",
          hoverCursor: "default"
        });
        
        // Set the id property
        line.set('id', `vertical_grid_line_${i}`);
        
        // Ensure this specific line instance will serialize the id
        line.toObject = (function(toObject) {
          return function() {
            const obj = toObject.call(this);
            obj.id = this.id;
            return obj;
          };
        })(line.toObject);
  
        canvas.add(line);
      }
  
      // Create horizontal lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new fabricModule.Line([0, i, width, i], {
          stroke: "#000",
          selectable: false,
          evented: false,
          name: "gridLines",
          hoverCursor: "default"
        });
        
        // Set the id property
        line.set('id', `horizontal_grid_line_${i}`);
        
        // Ensure this specific line instance will serialize the id
        line.toObject = (function(toObject) {
          return function() {
            const obj = toObject.call(this);
            obj.id = this.id;
            return obj;
          };
        })(line.toObject);
  
        canvas.add(line);
      }
  
      canvas.requestRenderAll();
      return true;
    }
  }
};
