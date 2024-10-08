import * as PIXI from 'pixi.js';
import { Tilemap } from './course/Tilemap';
import { Tileset } from './course/Tileset';

PIXI.BaseTexture.defaultOptions.scaleMode = 0;

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

// Load in a dancing bush tileset
const testTileset = await Tileset.from('assets/tileset.json');

// Create a new tilemap
const tilemap = new Tilemap();

// Add a tile to the tilemap
tilemap.addTile(testTileset, 4, 0, 0, 0);

app.stage.addChild(tilemap);
tilemap.scale.x = 8;
tilemap.scale.y = 8;

let frame = 0;

// Listen for animate update
app.ticker.add((delta) => {
  tilemap.tileAnim = [Math.floor(frame / 16), Math.floor(frame / 16)];
  frame++;
});
