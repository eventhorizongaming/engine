/**
 * Loads any specific url as json
 * @param {string} url The url to load json from
 * @returns The json data loaded from the url
 */
export async function loadJSON(url) {
  const response = await fetch(url);
  return await response.json();
}
