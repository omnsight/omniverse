// Define the custom transition object
export const slideDownLeft = {
  in: { opacity: 1, transform: 'translate(0, 0)' },
  out: { opacity: 0, transform: 'translate(100%, -100%)' },
  common: { transitionProperty: 'transform, opacity' },
  transitionProperty: 'transform, opacity',
};

export const slideUpLeft = {
  in: { opacity: 1, transform: 'translate(0, 0)' },
  out: { opacity: 0, transform: 'translate(100%, 100%)' },
  common: { transitionProperty: 'transform, opacity' },
  transitionProperty: 'transform, opacity',
};
