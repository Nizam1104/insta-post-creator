export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const rgbStringToHex = (rgbString) => {
  // Extract numbers from rgb string using regex
  const matches = rgbString.match(/\d+/g);
  if (!matches || matches.length !== 3) return null;
  
  // Convert string numbers to integers
  const [r, g, b] = matches.map(Number);
  
  // Validate RGB values
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
  
  // Convert to hex using existing rgbToHex function
  return rgbToHex(r, g, b);
};


export const validateHex = (hex) => /^#[0-9A-Fa-f]{6}$/i.test(hex);
