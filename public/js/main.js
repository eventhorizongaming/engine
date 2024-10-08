import * as PIXI from 'pixi.js';
import { Tilemap } from './course/Tilemap';
import { Tileset } from './course/Tileset';

// Make all textures look pixelated
PIXI.BaseTexture.defaultOptions.scaleMode = 0;

// Create a new pixi.js app
const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

// Add the app to the dom
document.body.appendChild(app.view);

// Load in a dancing bush tileset
const testTileset = await Tileset.from('assets/tileset.json');

// Create a new tilemap
const tilemap = new Tilemap();

// Add a tile to the tilemap
tilemap.addTile(testTileset, 4, 0, 0, 0);

// Upscale the tilemap
tilemap.scale.x = 8;
tilemap.scale.y = 8;

// Add the tilemap to the stage
app.stage.addChild(tilemap);

// Update the tilemap every 16 frames
app.ticker.add((delta) => {
  tilemap.step(delta / 16);
});
