import * as PIXI from 'pixi.js';

/**
 * An extension of the pixi.js sprite that uses sprites from within a spritesheet
 */
export class Sprite extends PIXI.Sprite {
  spritesheet;
  currentSprite;
  currentFrame = 0;

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

  setSprite(name) {
    this.currentSprite = name;
    this.currentFrame = 0;
    this.updateTextureFraming();
  }

  updateTextureFraming() {
    const textureFraming = this.spritesheet.getSprite(this.currentSprite, this.currentFrame);
    this.setTextureFraming(textureFraming);
  }

  setTextureFraming(frame) {
    if (this.textureLoaded) {
      this.texture.frame = frame;
    }
  }

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