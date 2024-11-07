import { loadJSON } from '../../../util/loaders';
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
   * @param {PIXI.Texture} texture The texture the spritesheet is based off of.
   */
  constructor(texture) {
    this.texture = texture;
  }

  /**
   * Creates an entry for a sprite inside of the spritesheet based off of a configuration object.
   * @param {string} name A name for the sprite to be stored by.  Will be used to reference the sprite when using "getFrame".
   * @param {object} spriteConfig Configuration for the sprite.
   * @param {number} spriteConfig.speed The speed of the animation of the sprite relative to the tick speed.
   * @param {Array<Rectangle>} spriteConfig.frames A list of frames within the spritesheet.
   */
  addSprite(name, spriteConfig) {
    this.sprites[name] = spriteConfig;
  }

  /**
   * Gets a specific frame of an animation from a sprite.
   * @param {string} name The name of the sprite.
   * @param {number} [frame] Which frame of the animation to get.  Defaults to 0.
   * @returns A pixi.js rectangle representing the location and dimensions of the frame in the spritesheet.
   */
  getFrame(name, frame = 0) {
    const frames = this.sprites[name].frames;
    const frameBounds = frames[Math.floor(frame % frames.length)];

    return frameBounds.clone();
  }

  /**
   * Gets the speed of the sprite's animation relative to the sprite's tick speed.
   * @param {string} name The name of the sprite.
   * @returns The animation speed of the sprite.
   */
  getSpriteAnimationSpeed(name) {
    return this.sprites[name].speed;
  }

  /**
   * Gets the number of frames in a sprite's animation.
   * @param {string} name The name of the sprite.
   * @returns The number of frames in the sprite's animation.
   */
  getSpriteFrameCount(name) {
    return this.sprites[name].frames.length;
  }

  /**
   * Gets the frame of the animation based off of a tick number (timestamp).  This is like "getFrame", but factors in the sprite's animation speed.
   * @param {string} name The name of the sprite to get the frame from.
   * @param {number} [tickNumber] The tick number (timestamp) of the animation to get the frame from.
   * @returns A pixi.js rectangle representing the location and dimensions of the frame in the spritesheet.
   */
  getFrameFromTickNumber(name, tickNumber = 0) {
    const spriteAnimationSpeed = this.getSpriteAnimationSpeed(name);

    return this.getFrame(name, tickNumber * spriteAnimationSpeed);
  }

  /**
   * (For animated sprites), calculates the location of a frame using the animation configuration.
   * @static
   * @param {object} config The animation data.
   * @param {string} frame The frame number of the animation to calculate.
   * @returns An object with the values "x" and "y" representing the location of the frame in the spritesheet.
   */
  static calculateFrameLocation(config, frame) {
    const frameX =
      config.location[0] + (config.size[0] + config.frameGap[0]) * (frame % config.frameGrid[0]);
    const frameY =
      config.location[1] +
      (config.size[1] + config.frameGap[1]) * Math.floor(frame / config.frameGrid[0]);

    return { x: frameX, y: frameY };
  }

  /**
   * Generates an array of frame boxes for the given sprite configuration
   * @static
   * @param {object} spriteData The sprite configuration
   * @returns An array of frame boxes
   */
  static calculateSpriteFrames(spriteData) {
    const frames = [];

    if (spriteData.animated) {
      for (let frame = 0; frame < spriteData.frameCount; frame++) {
        const frameLocation = SpriteSheet.calculateFrameLocation(spriteData, frame);
        const frameBox = new Rectangle(
          frameLocation.x,
          frameLocation.y,
          spriteData.size[0],
          spriteData.size[1],
        );

        frames.push(frameBox);
      }
    } else {
      const frameBox = new Rectangle(
        spriteData.location[0],
        spriteData.location[1],
        spriteData.size[0],
        spriteData.size[1],
      );

      frames.push(frameBox);
    }

    return frames;
  }

  /**
   * Generates a sprite configuration object from the sprite data
   * @param {object} spriteData The sprite data
   * @returns A brand new sprite configuration object
   */
  static generateSpriteConfig(spriteData) {
    return {
      frames: SpriteSheet.calculateSpriteFrames(spriteData),
      speed: spriteData?.speed ?? 1,
    };
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
