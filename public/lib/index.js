// Import the renderer related modules
import * as PIXI from 'pixi.js';
import * as TILEMAPS from '@pixi/tilemap';

import { Tilemap } from './src/rendering/tiles/Tilemap';
import { Tileset } from './src/rendering/tiles/Tileset';
import { TilesetDisplay } from './src/rendering/tiles/TilesetDisplay';

import { SpriteSheet } from './src/rendering/sprites/SpriteSheet';
import { Sprite } from './src/rendering/sprites/Sprite';

// Import the code utilities
import { loadJSON } from './src/util/loaders/jsonLoader';
import { loadText } from './src/util/loaders/textLoader';

import { Path } from './src/util/path';

import { runWith, runWithAsync } from './src/util/with';

// Export all of the modules
export {
  PIXI,
  TILEMAPS,
  Tilemap,
  Tileset,
  TilesetDisplay,
  SpriteSheet,
  Sprite,
  loadJSON,
  loadText,
  Path,
  runWith,
  runWithAsync
};
