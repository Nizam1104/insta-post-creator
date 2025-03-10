import { canvasState } from "./canvasState";
import { testServices } from "./testServices";
import { colorService } from "./colorService";
import { shadowService } from "./shadowService";
import { opacityService } from "./opacityService";
import { imageService } from "./imageService";
import { deleteService } from "./deleteService";
import { shapesService } from "./shapesService";
import { textService } from "./textService";
import { zIndexService } from "./zIndexService";
import { canvasEventsService } from "./canvasEventsService";
import { dimensionService } from "./dimensionService";
import { drawingModeService } from "./drawingModeService";
import { canvasDownloadService } from "./canvasDownloadService";


class CanvasService {
  canvas = null;
  fabricModule = null;
  history = [];
  historyIndex = -1;
  maxHistoryLength = 20;
  observers = [];
  isUndoRedoInProgress = false; // Flag to track undo/redo state

  initialize(canvas, fabricModule) {
    this.canvas = canvas;
    this.fabricModule = fabricModule;
    canvasState.activeCanvas = this
    canvasState.activeCanvasType = 'post'

    colorService.initialize(this);
    shadowService.initialize(this);
    opacityService.initialize(this);
    imageService.initialize(this);
    deleteService.initialize(this);
    shapesService.initialize(this);
    textService.initialize(this);
    zIndexService.initialize(this);
    canvasEventsService.initialize(this);
    dimensionService.initialize(this);
    drawingModeService.initialize(this);
    canvasDownloadService.initialize(this);

    testServices.initialize(this);

    this.canvas.on({
      "selection:updated": () => this.notifyObservers(),
      "selection:created": () => this.notifyObservers(),
      "selection:cleared": () => this.notifyObservers(),
      "object:modified": () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      },
      "object:added": () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      },
      "object:removed": () => {
        this.debouncedSave();
        this.debouncedAddToHistory();
      },
    });

    this.loadCanvas();
    if (this.history.length === 0) {
      this.addToHistory();
    }
  }

  getBackgroundColor() {
    if (!this.canvas) return null;
    return this.canvas.backgroundColor;
  }

  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(
        (observer) => observer !== callback
      );
    };
  }

  constructor() {
    this.debouncedSave = this.debounce(this.saveCanvas.bind(this), 100);
    this.debouncedAddToHistory = this.debounce(
      this.addToHistory.bind(this),
      100
    );
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  removeElementFromCanvas(element) {
    this.canvas.remove(element);
    this.canvas.renderAll();
  }

  notifyObservers() {
    const activeObject = this.canvas.getActiveObject();
    const selection = activeObject ? [activeObject] : [];
    this.observers.forEach((callback) => callback(selection));
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
      this.canvas.renderAll();

      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.historyIndex = parseInt(savedHistoryIndex) || -1;
      }

      setTimeout(() => {
        this.canvas.renderAll();
      }, 100);
    }
  }

  loadFromJson(jsonObj) {
    // Parse the JSON object if it's a string
    const parsedObj =
      typeof jsonObj === "string" ? JSON.parse(jsonObj) : jsonObj;

    // Create a new canvas state object with the parsed elements
    const canvasState = {
      objects: parsedObj,
      background: "#FFFFFF", // Set default background color directly
    };

    // Load the canvas with the new state
    this.canvas.loadFromJSON(canvasState, () => {
      // Set background color
      this.canvas.backgroundColor = canvasState.background;

      // Render all elements
      this.canvas.renderAll();

      // Optional: Adjust canvas dimensions if needed
      this.canvas.setDimensions({
        width: 500,
        height: 500,
      });
    });
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

  loadStateFromHistory() {
    if (!this.canvas || this.historyIndex < 0) return;

    this.isUndoRedoInProgress = true; // Block history updates during load
    const state = this.history[this.historyIndex];

    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
      this.saveCanvas();
      localStorage.setItem("canvasHistoryIndex", this.historyIndex);
      this.isUndoRedoInProgress = false; // Unblock after load
    });
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
}

export const canvasService = new CanvasService();
