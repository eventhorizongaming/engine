import * as ENGINE from '../../index'
import { loadJSON } from "../util/loaders/jsonLoader";
import { loadText } from "../util/loaders/textLoader";
import { runWithAsync } from '../util/with';

/**
 * An engine that can execute a game instance
 */
export class Runner {
  projectPath;
  projectConfig;
  projectScript;
  scriptEnvironment;
  renderer;

  /**
   * Creates a new runner instance
   * @constructor
   * @param {string} projectPath The path to the project folder
   */
  constructor(projectPath) {
    this.projectPath = projectPath;
  }

  /**
   * Initializes the class variables and executes initialization functions
   * @async
   */
  async initialize() {
    this.projectConfig = await loadJSON(this.projectPath + 'config.json');
    this.projectScript = await loadText(this.projectPath + 'main.js');

    await this.initializeRenderer();
    this.initializeScriptEnvironment();
  }

  /**
   * Initializes the PIXI.js runner and its config
   * @async
   */
  async initializeRenderer() {
    this.renderer = new ENGINE.PIXI.Application({ resizeTo: window, ...this.projectConfig.rendering.application });
    document.body.appendChild(this.renderer.view);
    globalThis.__PIXI_APP__ = this.renderer;

    this.updateRendererDefaults();
  }

  /**
   * Uses the information from the configuration to redefine the renderer's default settings
   */
  updateRendererDefaults() {
    const baseTextureOptions = this.projectConfig.rendering.defaults.baseTexture;
    const bitmapFontOptions = this.projectConfig.rendering.defaults.bitmapFont;
    const htmlTextStyleOptions = this.projectConfig.rendering.defaults.htmlTextStyle;

    for (const property of Object.keys(baseTextureOptions)) {
      ENGINE.PIXI.BaseTexture.defaultOptions[property] = baseTextureOptions[property];
    }

    for (const property of Object.keys(bitmapFontOptions)) {
      ENGINE.PIXI.BitmapFont.defaultOptions[property] = bitmapFontOptions[property];
    }

    for (const property of Object.keys(htmlTextStyleOptions)) {
      ENGINE.PIXI.HTMLTextStyle.defaultOptions[property] = htmlTextStyleOptions[property];
    }
  }

  /**
   * Generates a script environment for the runner.
   */
  initializeScriptEnvironment() {
    this.scriptEnvironment = {
      ...ENGINE,
      renderer: this.renderer
    }
  }

  /**
   * Executes a string as a game script
   * @param {string} script The script to execute
   */
  executeScript(script) {
    const projectScriptFunction = eval(`(async function () {\n${script}\n})`);
    runWithAsync(this.scriptEnvironment, projectScriptFunction);
  }

  /**
   * Begins the execution of the game
   */
  start() {
    this.executeScript(this.projectScript);
  }

  /**
   * Loads a game instance from a folder
   * @async
   * @static
   * @param {string} projectPath The path to the folder
   * @returns A brand new, fully initialized runner instance using the config from the game folder
   */
  static async load(projectPath) {
    const runner = new Runner(projectPath);
    await runner.initialize();
    
    return runner;
  }
}
