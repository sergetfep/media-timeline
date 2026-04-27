import { parseCoordinates } from '../src/js/coords';

describe('parseCoordinates', () => {
  test('parses coordinates with a space after comma', () => {
    expect(parseCoordinates('51.50851, −0.12572')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('parses coordinates without a space after comma', () => {
    expect(parseCoordinates('51.50851,−0.12572')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('parses coordinates in square brackets', () => {
    expect(parseCoordinates('[51.50851, −0.12572]')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('throws an error for wrong format', () => {
    expect(() => parseCoordinates('51.50851 -0.12572')).toThrow();
    expect(() => parseCoordinates('[51.50851, -0.12572')).toThrow();
    expect(() => parseCoordinates('text')).toThrow();
  });

  test('throws an error for out of range coordinates', () => {
    expect(() => parseCoordinates('91, 0')).toThrow();
    expect(() => parseCoordinates('0, 181')).toThrow();
  });
});
