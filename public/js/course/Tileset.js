import { loadJSON } from '../util/loaders';
import { Texture } from 'pixi.js';

class Tileset {
  texture;
  tileSize;
  animatedTiles = {};
  gridSize;

  /**
   * @constructor
   * @param {PIXI.Texture} texture The base tilemap texture
   * @param {Array.<number>} tileSize The dimensions of the 
   * @param {Array.<number>} gridSize The number
   */
  constructor(texture, tileSize, gridSize) {
    this.texture = texture;
    this.tileSize = tileSize;
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
      tileWidth: this.tileSize[0],
      tileHeight: this.tileSize[1],
      u: x * this.tileSize[0],
      v: y * this.tileSize[1],
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
    animationConfig.animDivisor = 1 / animationSettings?.fps;

    // Apply tile sizing
    animationConfig.tileWidth = this.tileSize[0];
    animationConfig.tileHeight = this.tileSize[1];

    // Apply the position settings
    animationConfig.u = animationSettings?.framesPosition[0] * this.tileSize[0];
    animationConfig.v = animationSettings?.framesPosition[1] * this.tileSize[1];

    // Apply the frame settings
    if (animationSettings?.axis === 'x') {
      animationConfig.animCountX = animationSettings?.numFrames;
      animationConfig.animX = this.tileSize[0] + animationSettings?.gap;
    } else if (animationSettings?.axis === 'y') {
      animationConfig.animCountY = animationSettings?.numFrames;
      animationConfig.animY = this.tileSize[1] + animationSettings?.gap;
    }

    this.animatedTiles[coords] = animationConfig;
  }

  /**
   * Loads a tileset from a configuration JSON file
   * @static
   * @param {string | object} config The path to the json file
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
