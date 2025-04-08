// Function to get color for a value between 0-100
export const getColorForValue = (value) => {
  // Enhanced color stops with yellow in the middle to avoid muddy brown
  const colorStops = [
    { value: 0, color: "#B71C1C" }, // Dark red
    { value: 25, color: "#ec1313" }, // Bright red
    { value: 50, color: "#FFC107" }, // Amber/yellow as intermediate color
    { value: 75, color: "#27AE60" }, // Medium green
    { value: 100, color: "#2ECC71" }, // Light green
  ];

  // Find the color stop that matches the exact value
  for (const stop of colorStops) {
    if (value === stop.value) return stop.color;
  }

  // Find the two color stops the value falls between
  let lowerIndex = 0;
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (
      value >= colorStops[i].value &&
      value <= colorStops[i + 1].value
    ) {
      lowerIndex = i;
      break;
    }
  }

  const lowerStop = colorStops[lowerIndex];
  const upperStop = colorStops[lowerIndex + 1];

  // Calculate the interpolation factor
  const range = upperStop.value - lowerStop.value;
  const factor =
    range !== 0 ? (value - lowerStop.value) / range : 0;

  // Interpolate the color in HSL space for better transitions
  return interpolateColorHSL(
    lowerStop.color,
    upperStop.color,
    factor
  );
};

// Convert hex to HSL for better color interpolation
const hexToHSL = (hex) => {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  let h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Convert to percentages
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
};

// Convert HSL to hex
const HSLToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  g = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  b = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
};

// Interpolate between two colors in HSL space for smoother transitions
const interpolateColorHSL = (color1, color2, factor) => {
  const hsl1 = hexToHSL(color1);
  const hsl2 = hexToHSL(color2);

  // Handle hue interpolation - take the shortest path around the color wheel
  let h = hsl1.h;
  const diff = hsl2.h - hsl1.h;

  if (Math.abs(diff) > 180) {
    // Go the other way around the color wheel
    if (hsl1.h < hsl2.h) {
      h = hsl1.h + 360 + factor * (hsl2.h - hsl1.h - 360);
    } else {
      h = hsl1.h + factor * (hsl2.h + 360 - hsl1.h);
    }
  } else {
    h = hsl1.h + factor * diff;
  }

  h = Math.round(h) % 360;
  const s = Math.round(hsl1.s + factor * (hsl2.s - hsl1.s));
  const l = Math.round(hsl1.l + factor * (hsl2.l - hsl1.l));

  return HSLToHex(h, s, l);
};
