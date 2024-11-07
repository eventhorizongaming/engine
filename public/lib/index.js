// Export the libraries used in the renderer
import * as PIXI from 'pixi.js';
import * as TILEMAPS from '@pixi/tilemap';

export { PIXI, TILEMAPS };

// Export the tile related items
import { Tilemap } from './src/rendering/tiles/Tilemap';
import { Tileset } from './src/rendering/tiles/Tileset';
import { TilesetDisplay } from './src/rendering/tiles/TilesetDisplay';

export { Tilemap, Tileset, TilesetDisplay };

// Export the sprite related items
import { SpriteSheet } from './src/rendering/sprites/SpriteSheet';
import { Sprite } from './src/rendering/sprites/Sprite';

export { SpriteSheet, Sprite };

// Import the loader related utilities
import { loadJSON } from './src/util/loaders/jsonLoader';
import { loadText } from './src/util/loaders/textLoader';

export { loadJSON, loadText };

// Import the path related utilities
import { Path } from './src/util/path';

export { Path };
