import { CompositeTilemap } from '@pixi/tilemap';

/**
 * An extension of the CompositeTilemap that allows you to use tilesets
 */
export class Tilemap extends CompositeTilemap {

  constructor(...params) {
    super(...params);
    this.tileAnim = [0, 0]
  }

  /**
   * Adds a tile to the tilemap instance
   * @param {Tileset} tileset The tileset to add the tile from
   * @param {number} tileX The x position of the desired tile on the tilemap
   * @param {number} tileY The y position of the desired tile on the tilemap
   * @param {number} gridX The x position in the tile grid where the tile should be added
   * @param {number} gridY The y position in the tile grid where the tile should be added
   */
  addTile(tileset, tileX, tileY, gridX, gridY) {
    this.tile(
      tileset.texture,
      tileset.tileSize.x * gridX,
      tileset.tileSize.y * gridY,
      tileset.getTile(tileX, tileY),
    );
  }

  /**
   * Steps the tileset forward in it's animation
   * @param {number} frames The number of frames forward to step in the animation
   */
  step(frames = 1) {
    this.tileAnim[0] += frames;
    this.tileAnim[1] += frames;
  }
}
