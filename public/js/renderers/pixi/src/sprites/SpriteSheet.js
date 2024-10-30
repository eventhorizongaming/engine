import { loadJSON } from '../../../../util/loaders';
import { Texture, Rectangle } from 'pixi.js';

export class SpriteSheet {
  sprites = {};
  texture;

  constructor(texture) {
    this.texture = texture;
  }

  /**
   * Adds a sprite record to the spritesheet.
   * @param {string} name The name of the sprite being added.
   * @param {object | Array<object>} frames An object or an array of objects containing the position, width, and height of each sprite.  Each object should contain x, y, w, and h values.
   */
  addSprite(name, frames) {
    if (Array.isArray(frames)) {
      this.sprites[name] = frames;
    } else {
      this.sprites[name] = [frames];
    }
  }

  getSprite(name, frame = 0) {
    const frameBounds = this.sprites[name][Math.floor(frame % this.sprites[name].length)]
    return frameBounds.clone();
  }

  static calculateFrameLocation(config, frame) {
    const frameX = config.location[0] + ((config.size[0] + config.frameGap[0]) * (frame % config.frameGrid[0]))
    const frameY = config.location[1] + ((config.size[1] + config.frameGap[1]) * Math.floor(frame / config.frameGrid[0]))

    return {x: frameX, y: frameY};
  }

  static calculateSpriteFrames(spriteConfig) {
    let frames = [];

    for (let frame = 0; frame < spriteConfig.frameCount; frame++) {
      const frameLocation = SpriteSheet.calculateFrameLocation(spriteConfig, frame);
      const frameBox = new Rectangle(frameLocation.x, frameLocation.y, spriteConfig.size[0], spriteConfig.size[1])

      frames.push(frameBox)
    }

    return frames;
  }

  /**
   * Loads a spritesheet from a configuration JSON file
   * @static
   * @param {string | object} config The path to the json file or a configuration object
   * @returns A new tileset instance
   */
  static async from(config) {
    const spritesheetData = typeof config === 'string' ? await loadJSON(config) : config;

    const texturePath = spritesheetData.texture;
    const texture = Texture.from(texturePath);

    const spritesheet = new SpriteSheet(texture);
    const sprites = Object.keys(spritesheetData.sprites);

    for (let sprite of sprites) {
      const spriteData = spritesheetData.sprites[sprite];

      if (spriteData.animated) {
        const frames = SpriteSheet.calculateSpriteFrames(spriteData);

        spritesheet.addSprite(sprite, frames);
      } else {
        spritesheet.addSprite(sprite,
          new Rectangle(
            spriteData.location[0],
            spriteData.location[1],
            spriteData.size[0],
            spriteData.size[1]
          )
        );
      }
    }

    return spritesheet;
  }
}