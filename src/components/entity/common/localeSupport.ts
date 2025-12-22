interface Attributable {
  attributes?: Record<string, any>;
}

export const getLocalizedAttribute = (
  attributable: Attributable | undefined,
  path: string,
  lang: string,
) => {
  if (!attributable || !attributable.attributes) return undefined;
  const attrs = attributable.attributes as Record<string, any>;
  const localeData = attrs[lang] || attrs[lang.split('-')[0]];

  if (!localeData) return undefined;

  return path
    .split('.')
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), localeData);
};
