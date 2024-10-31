import { loadJSON } from '../../../../util/loaders';
import { Texture, Rectangle } from 'pixi.js';

/**
 * A spritesheet file loader/handler.
 * @example
 * const spritesheet = await SpriteSheet.from("path/to/spritesheet.json");
 * const spriteBox = spritesheet.getFrame("my_sprite", 123);
 */
export class SpriteSheet {
  sprites = {};
  texture;

  /**
   * Creates a new SpriteSheet instance from a texture.
   * @constructor
   * @param {*} texture The texture the spritesheet is based off of.
   */
  constructor(texture) {
    this.texture = texture;
  }

  /**
   * Creates an entry for a sprite inside of the spritesheet based off of a configuration object.
   * @param {*} name A name for the sprite to be stored by.  Will be used to reference the sprite when using "getFrame".
   * @param {*} spriteConfig Configuration for the sprite.
   * @param {*} spriteConfig.speed The speed of the animation of the sprite relative to the tick speed.
   * @param {*} spriteConfig.frames A list of frames within the spritesheet.
   */
  addSprite(name, spriteConfig) {
    this.sprites[name] = spriteConfig;
  }

  /**
   * Gets a specific frame of an animation from a sprite.
   * @param {*} name The name of the sprite.
   * @param {*} [frame] Which frame of the animation to get.  Defaults to 0.
   * @returns A pixi.js rectangle representing the location and dimensions of the frame in the spritesheet.
   */
  getFrame(name, frame = 0) {
    const frames = this.sprites[name].frames;
    const frameBounds = frames[Math.floor(frame % frames.length)]

    return frameBounds.clone();
  }

  /**
   * Gets the speed of the sprite's animation relative to the sprite's tick speed.
   * @param {*} name The name of the sprite.
   * @returns The animation speed of the sprite.
   */
  getSpriteAnimationSpeed(name) {
    return this.sprites[name].speed;
  }

  /**
   * Gets the number of frames in a sprite's animation.
   * @param {*} name The name of the sprite.
   * @returns The number of frames in the sprite's animation.
   */
  getSpriteFrameCount(name) {
    return this.sprites[name].frames.length
  }

  getFrameFromTickNumber(name, frame = 0) {
    return this.getFrame(name, frame * this.getSpriteAnimationSpeed(name))
  }

  static calculateFrameLocation(config, frame) {
    const frameX = config.location[0] + ((config.size[0] + config.frameGap[0]) * (frame % config.frameGrid[0]))
    const frameY = config.location[1] + ((config.size[1] + config.frameGap[1]) * Math.floor(frame / config.frameGrid[0]))

    return {x: frameX, y: frameY};
  }

  static calculateSpriteFrames(spriteData) {
    const frames = [];

    if (spriteData.animated) {
      for (let frame = 0; frame < spriteData.frameCount; frame++) {
        const frameLocation = SpriteSheet.calculateFrameLocation(spriteData, frame);
        const frameBox = new Rectangle(frameLocation.x, frameLocation.y, spriteData.size[0], spriteData.size[1])
  
        frames.push(frameBox)
      }
    } else {
      const frameBox = new Rectangle(spriteData.location[0], spriteData.location[1], spriteData.size[0], spriteData.size[1])

      frames.push(frameBox)
    }

    return frames;
  }

  static generateSpriteConfig(spriteData) {
    return {
      frames: SpriteSheet.calculateSpriteFrames(spriteData),
      speed: spriteData?.speed ?? 1
    }
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
      const spriteConfig = SpriteSheet.generateSpriteConfig(spriteData);

      spritesheet.addSprite(sprite, spriteConfig);
    }

    return spritesheet;
  }
}