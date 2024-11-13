export class Path {
  /**
   * Gets the filename segment from the full url
   * @param {string} url The full url
   * @returns The filename segment of the url
   */
  static getFilename(url) {
    return url.split('/').reverse()[0];
  }

  /**
   * Gets the path segment from the full url
   * @param {string} url The full url
   * @returns The path segment of the url
   */
  static getPath(url) {
    return url.split('/').slice(0, -1).join('/') + '/';
  }

  /**
   * Checks to see if the url is a relative url
   * @param {string} url The url to check
   * @returns Whether or not it's a relative url
   */
  static isRelative(url) {
    return url.startsWith('.');
  }
}
