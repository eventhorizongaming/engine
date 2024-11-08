import * as ENGINE from '../../index'
import { loadJSON } from "../util/loaders/jsonLoader";
import { loadText } from "../util/loaders/textLoader";
import { runWithAsync } from '../util/with';

export class Runner {
  projectPath;
  projectConfig;
  projectScript;
  scriptEnvironment;
  renderer;

  constructor(projectPath) {
    this.projectPath = projectPath;
  }

  async initialize() {
    this.projectConfig = await loadJSON(this.projectPath + 'config.json');
    this.projectScript = await loadText(this.projectPath + 'main.js');

    await this.initializeRenderer();
    this.initializeScriptEnvironment();
  }

  async initializeRenderer() {
    this.renderer = new ENGINE.PIXI.Application({ resizeTo: window, ...this.projectConfig.rendering.application });
    document.body.appendChild(this.renderer.view);
    globalThis.__PIXI_APP__ = this.renderer;

    this.updateRendererDefaults();
  }

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

  initializeScriptEnvironment() {
    this.scriptEnvironment = {
      ...ENGINE,
      renderer: this.renderer
    }
  }

  executeScript(script) {
    const projectScriptFunction = eval(`(async function () {\n${script}\n})`);
    runWithAsync(this.scriptEnvironment, projectScriptFunction);
  }

  start() {
    this.executeScript(this.projectScript);
  }

  static async load(projectPath) {
    const runner = new Runner(projectPath);
    await runner.initialize();
    
    return runner;
  }
}
