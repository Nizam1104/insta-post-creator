export const canvasEventsService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
    this.setupEventHandlers();
  },

  setupEventHandlers() {
    if (!this.canvasService?.canvas) return;

    const canvas = this.canvasService.canvas;

    // Object selection events
    canvas.on('selection:created', (e) => this.handleSelectionCreated(e));
    canvas.on('selection:updated', (e) => this.handleSelectionUpdated(e));
    canvas.on('selection:cleared', (e) => this.handleSelectionCleared(e));

    // Object modification events
    canvas.on('object:modified', (e) => this.handleObjectModified(e));
    canvas.on('object:moving', (e) => this.handleObjectMoving(e));
    canvas.on('object:scaling', (e) => this.handleObjectScaling(e));
    canvas.on('object:rotating', (e) => this.handleObjectRotating(e));
    canvas.on('mouse:up', (e) => this.handleObjectMovedComplete(e));

    // Mouse events
    canvas.on('mouse:down', (e) => this.handleMouseDown(e));
    canvas.on('mouse:move', (e) => this.handleMouseMove(e));
    canvas.on('mouse:up', (e) => this.handleMouseUp(e));
  },

  handleSelectionCreated(e) {
    const selected = e.selected;
    if (selected && selected[0]) {
      const fill = selected[0].get('fill');
    }
  },

  handleSelectionUpdated(e) {
    // Handle selection updates
  },

  handleSelectionCleared(e) {
    // Handle selection cleared
  },

  handleObjectModified(e) {
    const target = e.target;
    if (target) {
      this.canvasService.saveCanvas();
    }
  },

  handleObjectMoving(e) {
    const canvas = this.canvasService.canvas;
    const movingObject = e.target;
    
    if (!canvas || !movingObject) return;

    const canvasCenter = {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
  
    // Clear previous guidelines
    this.clearGuidelines(canvas);
  
    // Draw new guidelines
    this.drawAlignmentGuidelines(canvas, movingObject, canvasCenter);
  
    canvas.renderAll();
  },
  
  handleObjectMovedComplete(e) {
    const canvas = this.canvasService.canvas;
    const movingObject = e.target;
    
    if (!canvas || !movingObject) return;

    const threshold = 5;
    const canvasCenter = {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
    const objCenter = movingObject.getCenterPoint?.();

    if (!objCenter) return;

    // Snap to canvas center if within threshold
    if (Math.abs(objCenter.x - canvasCenter.x) < threshold) {
      const width = movingObject.width * movingObject.scaleX;
      movingObject.set({ left: canvasCenter.x - width / 2 });
    }
    if (Math.abs(objCenter.y - canvasCenter.y) < threshold) {
      const height = movingObject.height * movingObject.scaleY;
      movingObject.set({ top: canvasCenter.y - height / 2 });
    }

    // Snap to other objects if within threshold
    canvas.getObjects().forEach(obj => {
      if (obj && obj !== movingObject) {
        const objBounds = obj.getBoundingRect?.();
        const movingBounds = movingObject.getBoundingRect?.();
        const objCenter = obj.getCenterPoint?.();
        const movingCenter = movingObject.getCenterPoint?.();

        if (!objBounds || !movingBounds || !objCenter || !movingCenter) return;

        // Vertical alignment
        if (Math.abs(movingBounds.left - objBounds.left) < threshold) {
          movingObject.set({ left: objBounds.left });
        }
        if (Math.abs(movingBounds.right - objBounds.right) < threshold) {
          const width = movingObject.width * movingObject.scaleX;
          movingObject.set({ left: objBounds.right - width });
        }
        if (Math.abs(movingCenter.x - objCenter.x) < threshold) {
          const width = movingObject.width * movingObject.scaleX;
          movingObject.set({ left: objCenter.x - width / 2 });
        }

        // Horizontal alignment
        if (Math.abs(movingBounds.top - objBounds.top) < threshold) {
          movingObject.set({ top: objBounds.top });
        }
        if (Math.abs(movingBounds.bottom - objBounds.bottom) < threshold) {
          const height = movingObject.height * movingObject.scaleY;
          movingObject.set({ top: objBounds.bottom - height });
        }
        if (Math.abs(movingCenter.y - objCenter.y) < threshold) {
          const height = movingObject.height * movingObject.scaleY;
          movingObject.set({ top: objCenter.y - height / 2 });
        }
      }
    });

    this.clearGuidelines(canvas);
    canvas.renderAll();
    this.canvasService.saveCanvas();
  },
  
  clearGuidelines(canvas) {
    if (!canvas?.contextTop) return;
    canvas.contextTop.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
  },
  
  drawAlignmentGuidelines(canvas, movingObject, canvasCenter) {
    if (!movingObject?.getCenterPoint) return;
    
    const objCenter = movingObject.getCenterPoint();
    const threshold = 5;
  
    this.drawCenterAlignmentGuidelines(canvas, objCenter, canvasCenter, threshold);
  
    canvas.getObjects().forEach(obj => {
      if (obj && obj !== movingObject) {
        this.drawObjectAlignmentGuidelines(canvas, movingObject, obj, threshold);
      }
    });
  },
  
  drawCenterAlignmentGuidelines(canvas, objCenter, canvasCenter, threshold) {
    if (!objCenter || !canvasCenter) return;
    
    if (Math.abs(objCenter.x - canvasCenter.x) < threshold) {
      this.drawGuideline(canvas, canvasCenter.x, 0, canvasCenter.x, canvas.getHeight(), '#00ff00');
    }
  
    if (Math.abs(objCenter.y - canvasCenter.y) < threshold) {
      this.drawGuideline(canvas, 0, canvasCenter.y, canvas.getWidth(), canvasCenter.y, '#00ff00');
    }
  },
  
  drawObjectAlignmentGuidelines(canvas, movingObject, targetObj, threshold) {
    if (!targetObj?.getBoundingRect || !movingObject?.getBoundingRect) return;
    
    const objBounds = targetObj.getBoundingRect();
    const movingBounds = movingObject.getBoundingRect();
    const objCenter = targetObj.getCenterPoint?.();
    const movingCenter = movingObject.getCenterPoint?.();

    if (!objBounds || !movingBounds || !objCenter || !movingCenter) return;
  
    const verticalAlignments = [
      { moving: movingBounds.left, target: objBounds.left },
      { moving: movingBounds.right, target: objBounds.right },
      { moving: movingBounds.left, target: objBounds.right },
      { moving: movingBounds.right, target: objBounds.left }
    ];
  
    verticalAlignments.forEach(({moving, target}) => {
      if (Math.abs(moving - target) < threshold) {
        this.drawGuideline(canvas, target, 0, target, canvas.getHeight(), '#ff0000');
      }
    });
  
    const horizontalAlignments = [
      { moving: movingBounds.top, target: objBounds.top },
      { moving: movingBounds.bottom, target: objBounds.bottom },
      { moving: movingBounds.top, target: objBounds.bottom },
      { moving: movingBounds.bottom, target: objBounds.top }
    ];
  
    horizontalAlignments.forEach(({moving, target}) => {
      if (Math.abs(moving - target) < threshold) {
        this.drawGuideline(canvas, 0, target, canvas.getWidth(), target, '#ff0000');
      }
    });
  
    if (Math.abs(movingCenter.x - objCenter.x) < threshold) {
      this.drawGuideline(canvas, objCenter.x, 0, objCenter.x, canvas.getHeight(), '#0000ff');
    }
    if (Math.abs(movingCenter.y - objCenter.y) < threshold) {
      this.drawGuideline(canvas, 0, objCenter.y, canvas.getWidth(), objCenter.y, '#0000ff');
    }
  },
  
  drawGuideline(canvas, startX, startY, endX, endY, color) {
    if (!canvas?.contextTop) return;
    canvas.contextTop.strokeStyle = color;
    canvas.contextTop.beginPath();
    canvas.contextTop.moveTo(startX, startY);
    canvas.contextTop.lineTo(endX, endY);
    canvas.contextTop.stroke();
  },

  handleObjectScaling(e) {
    // Handle object scaling
  },

  handleObjectRotating(e) {
    // Handle object rotating
  },

  handleMouseDown(e) {
    // Handle mouse down
  },

  handleMouseMove(e) {
    // Handle mouse move
  },

  handleMouseUp(e) {
    // Handle mouse up
  }
};
