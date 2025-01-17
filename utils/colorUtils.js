export const hexToRgb = (hex) => {
  if (!validateHex(hex)) return null;
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
  if (
    typeof r !== "number" ||
    typeof g !== "number" ||
    typeof b !== "number" ||
    r < 0 ||
    r > 255 ||
    g < 0 ||
    g > 255 ||
    b < 0 ||
    b > 255
  ) {
    return null;
  }
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
};

export const rgbStringToHex = (rgbString) => {
  if (!rgbString) return rgbToHex(0, 0, 0);

  if (rgbString.startsWith("#")) return validateHex(rgbString) ? rgbString : "#FFFFFF";

  if (rgbString.startsWith("rgb(")) {
    const matches = rgbString.match(/\d+/g);
    if (!matches || matches.length !== 3) return null;

    const [r, g, b] = matches.map(Number);
    return rgbToHex(r, g, b);
  }

  const hexCode = colorToHexcodeMap[rgbString.toLowerCase()];
  return hexCode ? hexCode : null;
};

export const colorToHexcodeMap = {
  black: "#000000",
  silver: "#C0C0C0",
  gray: "#808080",
  white: "#FFFFFF",
  maroon: "#800000",
  red: "#FF0000",
  purple: "#800080",
  fuchsia: "#FF00FF",
  green: "#008000",
  lime: "#00FF00",
  olive: "#808000",
  yellow: "#FFFF00",
  navy: "#000080",
  blue: "#0000FF",
  teal: "#008080",
  aqua: "#00FFFF",
  orange: "#FFA500",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gold: "#FFD700",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  beige: "#F5F5DC",
  coral: "#FF7F50",
  indigo: "#4B0082",
  violet: "#EE82EE",
  khaki: "#F0E68C",
  lavender: "#E6E6FA",
  plum: "#DDA0DD",
  salmon: "#FA8072",
  turquoise: "#40E0D0",
};

export const validateHex = (hex) => /^#[0-9A-Fa-f]{6}$/i.test(hex);
