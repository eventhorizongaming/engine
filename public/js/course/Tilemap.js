import { Texture } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';

export class Tilemap extends CompositeTilemap {
  constructor(tileset) {
    super();

    console.log(tileset);

    const bush = Texture.from('assets/bush.png')

    console.log(tileset.getTile(4, 0));

    this.tile(tileset.texture, 0, 0, tileset.getTile(4, 0));
    this.tile(tileset.texture, 16, 0, tileset.getTile(4, 0));
  }
}
