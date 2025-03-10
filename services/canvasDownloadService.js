export const canvasDownloadService = {
  canvasService: null,
  
  initialize(canvasService) {
    this.canvasService = canvasService;
  },

  downloadCanvasAsPng() {
    if (!this.canvasService.canvas) return;
    
    // Get canvas element
    const canvasEl = this.canvasService.canvas.getElement();
    
    // Create temporary link element
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = canvasEl.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
