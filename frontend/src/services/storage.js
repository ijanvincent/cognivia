export function parseStoredJson(value, fallback = {}) {
  if (!value || value === 'undefined' || value === 'null') {
    return fallback;
  }

  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

export function unwrapResourceData(value) {
  return value?.data && typeof value.data === 'object' ? value.data : value;
}
