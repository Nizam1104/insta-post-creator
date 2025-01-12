"use client"
import { useRef, useEffect } from 'react';
import { canvasService } from '../services/canvasService';

const PostCanvas = () => {
  const canvasRef = useRef(null);
  const instagramSize = 1080;

  useEffect(() => {
    if (canvasRef.current) {
      canvasService.initialize(canvasRef.current);
      const savedColor = localStorage.getItem('postCanvasBgColour') || '#ffffff';
      canvasService.setCanvasColor(savedColor);
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={instagramSize}
        height={instagramSize}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          border: '1px solid #ddd'
        }}
      />
      <button 
        onClick={() => canvasService.downloadPng()}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        Download as PNG
      </button>
    </div>
  );
}

export default PostCanvas;
