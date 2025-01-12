class CanvasService {
  constructor() {
    this.canvas = null;
  }

  initialize(canvasElement) {
    this.canvas = canvasElement;
  }

  setCanvasColor(color) {
    if (!this.canvas) {
      console.warn('Canvas not initialized');
      return;
    }
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    localStorage.setItem('postCanvasBgColour', color);
  }

  downloadPng() {
    if (!this.canvas) {
      console.warn('Canvas not initialized');
      return;
    }
    const link = document.createElement('a');
    link.download = 'instagram-post.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

// Create a singleton instance
export const canvasService = new CanvasService(); 