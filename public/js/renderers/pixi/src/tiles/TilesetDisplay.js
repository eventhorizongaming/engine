import { Tilemap } from "./Tilemap";

export class TilesetDisplay extends Tilemap {
  constructor(tileset, ...params) {
    super(...params);

    for (let y = 0; y < tileset.gridSize.y; y++) {
      for (let x = 0; x < tileset.gridSize.x; x++) {
        this.addTile(tileset, x, y, x, y);
      }
    }
  }
}
