import * as PIXI from 'pixi.js';
import { TilesetDisplay, Tileset } from './renderers/pixi'

// Make all textures look pixelated
PIXI.BaseTexture.defaultOptions.scaleMode = 0;

// Create a new pixi.js app
const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

// Add the app to the dom
document.body.appendChild(app.view);

// Load in a dancing bush tileset
const testTileset = await Tileset.from('assets/tileset.json');

// Create a new tilemap display
const tilemap = new TilesetDisplay(testTileset);

// Upscale the tilemap
tilemap.scale.x = 8;
tilemap.scale.y = 8;

// Add the tilemap to the stage
app.stage.addChild(tilemap);

// Update the tilemap every 16 frames
app.ticker.add((delta) => {
  tilemap.step(delta / 16);
});
