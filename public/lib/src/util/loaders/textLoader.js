/**
 * Loads any specific url as text
 * @param {string} url The url to load text from
 * @returns The text data loaded from the url
 */
export async function loadText(url) {
  const response = await fetch(url);
  return await response.text();
}
