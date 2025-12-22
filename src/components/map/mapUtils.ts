export const getMinZoomForScreen = () => {
  // Rough calculation:
  // Height of world at Zoom 0 is ~256px
  // Height of world at Zoom 1 is ~512px
  const screenHeight = window.innerHeight;

  if (screenHeight > 1000) return 3; // Large Desktop
  if (screenHeight > 500) return 2; // Laptop/Tablet
  return 1; // Mobile
};
