import * as PIXI from 'pixi.js';

/**
 * An extension of the pixi.js sprite that uses sprites from within a spritesheet
 */
export class Sprite extends PIXI.Sprite {
  spritesheet;
  currentSprite;
  currentFrame = 0;

  /**
   * Creates a new Sprite instance from a spritesheet
   * @constructor
   * @param {SpriteSheet} spritesheet The spritesheet asset to use the sprites from
   */
  constructor(spritesheet) {
    super(spritesheet.texture.clone());
    this.spritesheet = spritesheet;

    // Pick a default sprite
    this.currentSprite = Object.keys(spritesheet.sprites)[0];

    // Update the texture's framing when it's loaded
    this.texture.baseTexture.on("loaded", () => {
      this.updateTextureFraming();
    })
  }

  /**
   * Sets which sprite is being used
   * @param {string} name The name of the sprite to switch to
   */
  setSprite(name) {
    this.currentSprite = name;
    this.currentFrame = 0;
    this.updateTextureFraming();
  }

  /**
   * Updates the texture's framing from the animation/sprite settings
   */
  updateTextureFraming() {
    const textureFraming = this.spritesheet.getFrameFromTickNumber(this.currentSprite, this.currentFrame);
    this.setTextureFraming(textureFraming);
  }

  /**
   * Sets the frame box of the sprite's texture
   * @param {PIXI.Rectangle} frame The new frame for the texture to use
   */
  setTextureFraming(frame) {
    if (this.textureLoaded) {
      this.texture.frame = frame;
    }
  }

  /**
   * Whether or not the spritesheet's texture has been loaded
   */
  get textureLoaded() {
    return this.texture.valid && this.texture.frame;
  }

  /**
   * Steps the sprite forward in its animation
   * @param {number} frames The number of frames forward to step in the animation
   */
  step(frames = 1) {
    this.currentFrame += frames;
    this.updateTextureFraming();
  }
}