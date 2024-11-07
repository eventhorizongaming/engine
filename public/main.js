import * as PIXI from 'pixi.js';
import { TilesetDisplay, Tileset, SpriteSheet, Sprite } from './lib';

// Make all textures look pixelated
PIXI.BaseTexture.defaultOptions.scaleMode = 0;

// Create a new pixi.js app
const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
globalThis.__PIXI_APP__ = app;

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

// Load in the mario spritesheet
const spritesheet = await SpriteSheet.from('assets/spritesheet.json');

// Create a Mario sprite
const mario = new Sprite(spritesheet);
mario.setSprite('walk')

mario.position.y = 128;
mario.scale.x = 8;
mario.scale.y = 8;

app.stage.addChild(mario);

// Update the assets every 16 frames
app.ticker.add((delta) => {
  tilemap.step(delta / 16);

  mario.step(delta / 16);
});
