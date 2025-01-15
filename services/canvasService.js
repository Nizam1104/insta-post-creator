import { toRGB } from "./utilFunctions";

class CanvasService {
  canvas = null;
  fabricModule = null;
  selectedElement = null;
  history = [];
  historyIndex = -1;
  maxHistoryLength = 20;
  observers = [];

  initialize(canvas, fabricModule) {
    this.canvas = canvas;
    this.fabricModule = fabricModule;

    this.canvas.on({
      'selection:updated': (e) => this.HandleElement(e),
      'selection:created': (e) => this.HandleElement(e),
      'selection:cleared': () => {
        this.clearSelectedElement()
      },
      'object:modified': () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      },
      'object:added': () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      },
      'object:removed': () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      }
    });

    this.loadCanvas();
    if (this.history.length === 0) {
      this.addToHistory();
    }
  }

  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(observer => observer !== callback);
    };
  }

  constructor() {
    this.debouncedSave = this.debounce(this.saveCanvas.bind(this), 100);
    this.debouncedAddToHistory = this.debounce(this.addToHistory.bind(this), 100);
  }

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  HandleElement(e) {
    // Clear selection if no elements are selected
    if (!e.selected || e.selected.length === 0) {
      this.selectedElement = null;
    } else {
      this.selectedElement = e.selected;
    }
    this.notifyObservers();
  }

  clearSelectedElement() {
    this.selectedElement = null;
    this.notifyObservers();
  }

  removeElementFromCanvas(element) {
    this.canvas.remove(element);
    this.canvas.renderAll()
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.selectedElement));
  }

  deleteSelectedElement() {
    if (!this.selectedElement || !this.canvas) return;
    
    // Handle both single elements and groups
    if (this.selectedElement._objects) {
      // If it's a group, remove all objects in the group
      this.selectedElement._objects.forEach(element => {
        this.canvas.remove(element);
      });
      this.canvas.remove(this.selectedElement);
    } else {
      // If it's multiple selected elements
      this.selectedElement.forEach(element => {
        this.removeElementFromCanvas(element);
      });
    }
    
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.clearSelectedElement();
    this.saveCanvas();
  }

  setElementColor(colorCode) {
    if (!this.selectedElement) return;
    const x = toRGB(colorCode);
    this.selectedElement[0].set('fill', `rgb(${x?.r || 0}, ${x?.g || 0}, ${x?.b || 0})`);
    this.saveCanvas()
    this.canvas.renderAll();
  }

  setCanvasColor(color) {
    if (this.canvas) {
      this.canvas.backgroundColor = color;
      this.canvas.renderAll();
      localStorage.setItem('postCanvasBgColour', color);
    }
    this.saveCanvas();
  }

  setElementOpacity(opacity) {
    if (!this.selectedElement) return;
    
    // Handle both single elements and groups
    if (this.selectedElement._objects) {
      // If it's a group, set opacity for all objects in the group
      this.selectedElement._objects.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords(); // Add this line
      });
      this.selectedElement.set('opacity', opacity);
      this.selectedElement.setCoords(); // Add this line
    } else {
      // If it's multiple selected elements
      this.selectedElement.forEach(element => {
        element.set('opacity', opacity);
        element.setCoords(); // Add this line
      });
    }
    
    // Remove setTimeout and render immediately
    this.saveCanvas();
    this.canvas.renderAll();
  }

  setElementShadow(options) {
    if (!this.selectedElement) return;
    
    const shadow = new this.fabricModule.Shadow({
      color: options.color || 'rgba(0,0,0,0.5)',
      blur: options.blur || 10,
      offsetX: options.offsetX || 5,
      offsetY: options.offsetY || 5
    });

    // Handle both single elements and groups
    if (this.selectedElement._objects) {
      // If it's a group, set shadow for all objects in the group
      this.selectedElement._objects.forEach(element => {
        element.set('shadow', shadow);
      });
      this.selectedElement.set('shadow', shadow);
    } else {
      // If it's multiple selected elements
      this.selectedElement.forEach(element => {
        element.set('shadow', shadow);
      });
    }
    
    setTimeout(() => {
      this.canvas.renderAll();
    }, 30)
    this.saveCanvas();
  }

  removeElementShadow() {
    if (!this.selectedElement) return;
    
    // Handle both single elements and groups
    if (this.selectedElement._objects) {
      // If it's a group, remove shadow from all objects in the group
      this.selectedElement._objects.forEach(element => {
        element.set('shadow', null);
      });
      this.selectedElement.set('shadow', null);
    } else {
      // If it's multiple selected elements
      this.selectedElement.forEach(element => {
        element.set('shadow', null);
      });
    }
  
    setTimeout(() => {
      this.canvas.renderAll();
    }, 30)
    this.saveCanvas();
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

  async addImage(imageUrl) {
    if (!this.canvas || !this.fabricModule || !imageUrl) return;

    const img = await this.fabricModule.Image.fromURL(imageUrl);
    img.set({
      left: 100,
      top: 100,
      angle: 0,
      scaleX: 0.3,
      scaleY: 0.3
    });

    this.canvas.add(img);
  }

  addText(textValue) {
    if (!this.canvas || !this.fabricModule || !textValue) return;

    const textEle = new this.fabricModule.FabricText(textValue);
    this.canvas.add(textEle);
    this.canvas.renderAll();
    this.saveCanvas();
  }

  saveCanvas() {
    if (!this.canvas) return;
    const canvasJSON = this.canvas.toJSON();
    localStorage.setItem("savedCanvas", JSON.stringify(canvasJSON));
  }

  loadCanvas() {
    if (!this.canvas) return;
    const savedCanvas = localStorage.getItem("savedCanvas");
    const savedHistory = localStorage.getItem("canvasHistory");
    const savedHistoryIndex = localStorage.getItem("canvasHistoryIndex");

    if (savedCanvas) {
      this.canvas.loadFromJSON(JSON.parse(savedCanvas));
      const color = localStorage.getItem('postCanvasBgColour') || '#FFFFFF';
      this.canvas.backgroundColor = color;

      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.historyIndex = parseInt(savedHistoryIndex) || -1;
      }

      setTimeout(() => {
        this.canvas.renderAll();
      }, 100);
    }
  }

  addToHistory() {
    if (!this.canvas) return;
    
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    const state = this.canvas.toJSON();
    this.history.push(state);
    this.historyIndex++;
    
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
      this.historyIndex--;
    }

    localStorage.setItem("canvasHistory", JSON.stringify(this.history));
    localStorage.setItem("canvasHistoryIndex", this.historyIndex);
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.loadStateFromHistory();
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.loadStateFromHistory();
  }

  loadStateFromHistory() {
    if (!this.canvas || this.historyIndex < 0) return;
    
    const state = this.history[this.historyIndex];
    const currentBgColor = this.canvas.backgroundColor;
    
    this.canvas.loadFromJSON(state);
    setTimeout(() => {
      this.canvas.backgroundColor = currentBgColor;
      this.canvas.renderAll();
      
      this.saveCanvas();
      localStorage.setItem("canvasHistoryIndex", this.historyIndex);
    }, 30)
  }
}

export const canvasService = new CanvasService();
