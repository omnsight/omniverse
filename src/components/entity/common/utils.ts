/**
 * Check if a value is empty (null, undefined, or empty string)
 */
const isEmpty = (val: any): boolean => val === null || val === undefined || val === '';

/**
 * Deep compare two values to check if they are different.
 * Treats null, undefined, and '' as equivalent.
 */
const isDifferent = (val1: any, val2: any): boolean => {
  // Handle empty values (null, undefined, "") as equivalent
  if (isEmpty(val1) && isEmpty(val2)) {
    return false;
  }

  // If one is empty and other is not (and not both empty handled above)
  if (isEmpty(val1) !== isEmpty(val2)) {
    return true;
  }

  // Deep compare objects/arrays
  if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
    // Arrays
    if (Array.isArray(val1) || Array.isArray(val2)) {
      // If one is array and other is not
      if (!Array.isArray(val1) || !Array.isArray(val2)) return true;
      // Simple array comparison
      return JSON.stringify(val1) !== JSON.stringify(val2);
    }

    // Objects
    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);

    // Union of keys
    const allKeys = new Set([...keys1, ...keys2]);
    for (const key of allKeys) {
      if (isDifferent(val1[key], val2[key])) {
        return true;
      }
    }
    return false;
  }

  return val1 !== val2;
};

/**
 * Returns a partial object containing only the fields from candidate that are different from original.
 */
export const getChangedFields = <T extends Record<string, any>>(
  candidate: Partial<T>,
  original: T,
): Partial<T> => {
  const result: Partial<T> = {};

  (Object.keys(candidate) as Array<keyof T>).forEach((key) => {
    const newVal = candidate[key];
    const origVal = original[key];
    if (isDifferent(newVal, origVal)) {
      result[key] = newVal;
    }
  });

  return result;
};
