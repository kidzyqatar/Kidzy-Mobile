/**
 * API entities expose `name` / `description` and optional Arabic fields.
 */
export function getLocalizedName(entity, language) {
  if (!entity) {
    return '';
  }
  if (language === 'AR' && entity.ar_name) {
    return entity.ar_name;
  }
  return entity.name ?? '';
}

export function getLocalizedDescription(entity, language) {
  if (!entity) {
    return '';
  }
  if (language === 'AR' && entity.ar_description) {
    return entity.ar_description;
  }
  return entity.description ?? '';
}
