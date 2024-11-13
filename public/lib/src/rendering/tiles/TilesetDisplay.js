import { Tilemap } from './Tilemap';

/**
 * A container to display every tile in a tilemap
 */
export class TilesetDisplay extends Tilemap {
  /**
   * Creates a new tileset display instance
   * @param {Tileset} tileset The tileset to generate a display from
   * @param  {...any} params Extra params that the tilemap should use
   */
  constructor(tileset, ...params) {
    super(...params);

    for (let y = 0; y < tileset.gridSize.y; y++) {
      for (let x = 0; x < tileset.gridSize.x; x++) {
        this.addTile(tileset, x, y, x, y);
      }
    }
  }
}
