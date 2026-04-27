const coordinatePattern =
  /^([+\-−]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*([+\-−]?(?:\d+(?:\.\d+)?|\.\d+))$/;

function normalizeNumber(value) {
  return Number(value.replace('−', '-'));
}

export function parseCoordinates(value) {
  if (typeof value !== 'string') {
    throw new Error('Координаты должны быть строкой');
  }

  const trimmed = value.trim();
  const startsWithBracket = trimmed.startsWith('[');
  const endsWithBracket = trimmed.endsWith(']');

  if (!trimmed || startsWithBracket !== endsWithBracket) {
    throw new Error('Некорректный формат координат');
  }

  const prepared = startsWithBracket ? trimmed.slice(1, -1).trim() : trimmed;
  const match = prepared.match(coordinatePattern);

  if (!match) {
    throw new Error('Некорректный формат координат');
  }

  const latitude = normalizeNumber(match[1]);
  const longitude = normalizeNumber(match[2]);

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Координаты выходят за допустимый диапазон');
  }

  return { latitude, longitude };
}
