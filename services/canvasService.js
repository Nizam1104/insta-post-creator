import { colorService } from "./colorService";
import { shadowService } from "./shadowService";
import { opacityService } from "./opacityService";
import { imageService } from "./imageService";
import { deleteService } from "./deleteService";
import { shapesService } from "./shapesService";
import { textService } from "./textService";

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

    colorService.initialize(this)
    shadowService.initialize(this)
    opacityService.initialize(this)
    imageService.initialize(this)
    deleteService.initialize(this)
    shapesService.initialize(this)
    textService.initialize(this)


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
    this.selectedElement = e.selected || [];
    this.notifyObservers();
  }

  clearSelectedElement() {
    this.selectedElement = [];
    this.notifyObservers();
  }

  removeElementFromCanvas(element) {
    this.canvas.remove(element);
    this.canvas.renderAll()
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.selectedElement));
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
