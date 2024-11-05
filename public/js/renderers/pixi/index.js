// Export the libraries used in the renderer
import * as PIXI from 'pixi.js';
import * as TILEMAPS from '@pixi/tilemap';

export { PIXI, TILEMAPS };

// Export the tile related items
import { Tilemap } from './src/tiles/Tilemap';
import { Tileset } from './src/tiles/Tileset';
import { TilesetDisplay } from './src/tiles/TilesetDisplay';

export { Tilemap, Tileset, TilesetDisplay };

// Export the sprite related items
import { SpriteSheet } from './src/sprites/SpriteSheet';
import { Sprite } from './src/sprites/Sprite';

export { SpriteSheet, Sprite };
