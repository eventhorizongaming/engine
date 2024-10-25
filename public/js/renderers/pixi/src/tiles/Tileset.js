import { loadJSON } from '../../../../util/loaders';
import { Texture } from 'pixi.js';

/**
 * A tileset handler for use with a tilemap
 * @example
 * const tileset = await Tileset.from("path/to/tileset.json");
 */
class Tileset {
  texture;
  tileSize;
  animatedTiles = {};
  gridSize;

  /**
   * @constructor
   * @param {PIXI.Texture} texture The base tilemap texture
   * @param {Array.<number>} tileSize The dimensions of an individual tile in pixels, using the format [width, height]
   * @param {Array.<number>} gridSize The number of rows and columns in the tileset, using the format [cols, rows]
   */
  constructor(texture, tileSize, gridSize) {
    this.texture = texture;
    this.tileSize = { x: tileSize[0], y: tileSize[1] };
    this.gridSize = { x: gridSize[0], y: gridSize[1] };
  }

  /**
   * Generates a config object for the specified tile
   * @param {number} x The x-position of the tile (in the tilemap grid)
   * @param {number} y The y-position of the tile (in the tilemap grid)
   * @returns A config object for the specified tile
   */
  getTile(x, y) {
    const animatedTile = this.animatedTiles[`${x},${y}`];

    if (animatedTile) {
      return animatedTile;
    }

    return {
      tileWidth: this.tileSize.x,
      tileHeight: this.tileSize.y,
      u: x * this.tileSize.x,
      v: y * this.tileSize.y,
    };
  }

  /**
   * Adds an animated tile to the tilemap
   * @param {string} coords The position in the tilemap to add an animated tile.  Should be in format "x,y"
   * @param {object} animationSettings The configuration for the animated tile
   */
  addAnimatedTile(coords, animationSettings) {
    const animationConfig = {};

    // Apply the speed setting
    animationConfig.animDivisor = 1 / animationSettings?.speed;

    // Apply tile sizing
    animationConfig.tileWidth = this.tileSize.x;
    animationConfig.tileHeight = this.tileSize.y;

    // Apply the position settings
    animationConfig.u = animationSettings?.framesPosition[0] * this.tileSize.x;
    animationConfig.v = animationSettings?.framesPosition[1] * this.tileSize.y;

    // Apply the frame settings
    if (animationSettings?.axis === 'x') {
      animationConfig.animCountX = animationSettings?.numFrames;
      animationConfig.animX = this.tileSize.x + (animationSettings?.gap * this.tileSize.x);
    } else if (animationSettings?.axis === 'y') {
      animationConfig.animCountY = animationSettings?.numFrames;
      animationConfig.animY = this.tileSize.y + (animationSettings?.gap * this.tileSize.y);
    }

    this.animatedTiles[coords] = animationConfig;
  }

  /**
   * Loads a tileset from a configuration JSON file
   * @static
   * @param {string | object} config The path to the json file or a configuration object
   * @returns A new tileset instance
   */
  static async from(config) {
    const tilesetData = typeof config === 'string' ? await loadJSON(config) : config;

    const texturePath = tilesetData.texture;
    const texture = Texture.from(texturePath);

    const tileset = new Tileset(texture, tilesetData.tileSize, tilesetData.gridSize);

    for (let tile in tilesetData.animatedTiles) {
      tileset.addAnimatedTile(tile, tilesetData.animatedTiles[tile]);
    }

    return tileset;
  }
}

export { Tileset };
