const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.1, // Very aggressive compression
    mimeType = 'image/jpeg' // JPEG typically provides better compression than PNG
  } = options;

  // Create a temporary URL for the file
  const createImageUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Load the image
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  try {
    // Convert File to URL
    const imageUrl = await createImageUrl(file);
    const img = await loadImage(imageUrl);

    // Calculate new dimensions while maintaining aspect ratio
    let width = img.width;
    let height = img.height;
    
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Draw and compress
    ctx.fillStyle = '#FFFFFF'; // Handle transparency in JPEGs
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Additional compression techniques
    if (mimeType === 'image/jpeg') {
      // For JPEG, we can reduce color data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Reduce color depth
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] / 32) * 32;     // Red
        data[i + 1] = Math.round(data[i + 1] / 32) * 32; // Green
        data[i + 2] = Math.round(data[i + 2] / 32) * 32; // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    // Convert to blob
    const getBlob = () => {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, mimeType, quality);
      });
    };

    const compressedBlob = await getBlob();
    
    // Create a new file from the blob
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, "") + "_compressed" + (mimeType === 'image/jpeg' ? '.jpg' : '.png'),
      {
        type: mimeType,
        lastModified: Date.now()
      }
    );

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};

export default compressImage;
