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

  highlightGridLinePoints() {
    const gridLines = this.canvasService.canvas.getObjects().filter(obj => 
      obj.name === 'gridLines' && 
      (obj.id?.includes('vertical_grid_line') || obj.id?.includes('horizontal_grid_line'))
    );

    if (!gridLines.length) return;
  },

  handleObjectMoving(e) {
    const canvas = this.canvasService.canvas;
    const movingObject = e.target;
    
    if (!canvas || !movingObject) return;

    // Clear previous highlights
    this.clearGuidelines(canvas);
  
    // Get grid lines
    const gridLines = canvas.getObjects().filter(obj => 
      obj.name === 'gridLines' && 
      (obj.id?.includes('vertical_grid_line') || obj.id?.includes('horizontal_grid_line'))
    );

    if (!gridLines.length) return;

    // Get object bounds and points
    const bounds = movingObject.getBoundingRect();
    const points = [
      {x: bounds.left, y: bounds.top}, // top-left
      {x: bounds.left + bounds.width/2, y: bounds.top}, // top-center
      {x: bounds.right, y: bounds.top}, // top-right
      {x: bounds.left, y: bounds.top + bounds.height/2}, // middle-left
      {x: bounds.left + bounds.width/2, y: bounds.top + bounds.height/2}, // center
      {x: bounds.right, y: bounds.top + bounds.height/2}, // middle-right
      {x: bounds.left, y: bounds.bottom}, // bottom-left
      {x: bounds.left + bounds.width/2, y: bounds.bottom}, // bottom-center
      {x: bounds.right, y: bounds.bottom} // bottom-right
    ];

    const threshold = 5;

    // Check each point against grid lines
    points.forEach(point => {
      gridLines.forEach(gridLine => {
        if (gridLine.id.includes('vertical')) {
          // Vertical line - check x position
          if (Math.abs(point.x - gridLine.left) < threshold) {
            this.drawGridIntersectionHighlight(canvas, gridLine.left, point.y);
          }
        } else if (gridLine.id.includes('horizontal')) {
          // Horizontal line - check y position
          if (Math.abs(point.y - gridLine.top) < threshold) {
            this.drawGridIntersectionHighlight(canvas, point.x, gridLine.top);
          }
        }
      });
    });

    canvas.renderAll();
  },

  drawGridIntersectionHighlight(canvas, x, y) {
    if (!canvas?.contextTop) return;
    
    const ctx = canvas.contextTop;
    const radius = 5;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.stroke();
  },

  handleObjectMovedComplete(e) {
    const canvas = this.canvasService.canvas;
    const movingObject = e.target;
    
    if (!canvas || !movingObject) return;

    this.clearGuidelines(canvas);
    canvas.renderAll();
    this.canvasService.saveCanvas();
  },
  
  clearGuidelines(canvas) {
    if (!canvas?.contextTop) return;
    canvas.contextTop.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
  },

  handleObjectScaling(e) {
    // Handle object scaling
  },

  handleObjectRotating(e) {
    const canvas = this.canvasService.canvas;
    const rotatingObject = e.target;
    if (!canvas || !rotatingObject) return;

    this.clearGuidelines(canvas);
    canvas.renderAll();
  },

  handleObjectRotatedComplete(e) {
    const canvas = this.canvasService.canvas;
    const rotatingObject = e.target;
    if (!canvas || !rotatingObject) return;

    this.clearGuidelines(canvas);
    canvas.renderAll();
    this.canvasService.saveCanvas();
  },

  handleMouseDown(e) {
    // Handle mouse down
  },

  handleMouseMove(e) {
    // Handle mouse move
  },

  handleMouseUp(e) {
    if (e.target && e.target.isType('activeSelection')) {
      this.handleObjectRotatedComplete(e);
    }
  }
};
