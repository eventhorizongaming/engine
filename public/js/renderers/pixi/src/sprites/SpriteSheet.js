import { loadJSON } from '../../../../util/loaders';
import { Texture } from 'pixi.js';

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
    return this.sprites[name][Math.floor(frame % this.sprites[name].length)]
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
        let frames = [];

        for (let frame = 0; frame < spriteData.frameCount; frame++) {
          frames.push({
            x: spriteData.location[0] + ((spriteData.size[0] + spriteData.frameGap[0]) * (frame % spriteData.frameGrid[0])),
            y: spriteData.location[1] + ((spriteData.size[1] + spriteData.frameGap[1]) * Math.floor(frame / spriteData.frameGrid[0])),
            w: spriteData.size[0],
            h: spriteData.size[1]
          })
        }

        spritesheet.addSprite(sprite, frames);
      } else {
        spritesheet.addSprite(sprite,
          {
            x: spriteData.location[0],
            y: spriteData.location[1],
            w: spriteData.size[0],
            h: spriteData.size[1]
          }
        );
      }
    }

    return spritesheet;
  }
}