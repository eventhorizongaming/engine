// Make all textures look pixelated
PIXI.BaseTexture.defaultOptions.scaleMode = 0;

// Load in a dancing bush tileset
const testTileset = await Tileset.from('/resources/tilesets/tileset.json');

// Create a new tilemap display
const tilemap = new TilesetDisplay(testTileset);

// Upscale the tilemap
tilemap.scale.x = 8;
tilemap.scale.y = 8;

// Add the tilemap to the stage
renderer.stage.addChild(tilemap);

// Load in the mario spritesheet
const spritesheet = await SpriteSheet.from('/resources/spritesheets/spritesheet.json');

// Create a Mario sprite
const mario = new Sprite(spritesheet);
mario.setSprite('walk')

mario.position.y = 128;
mario.scale.x = 8;
mario.scale.y = 8;

renderer.stage.addChild(mario);

// Update the assets every 16 frames
renderer.ticker.add((delta) => {
  tilemap.step(delta / 16);

  mario.step(delta / 16);
});
