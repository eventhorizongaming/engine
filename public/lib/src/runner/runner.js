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
  }

  async initializeRenderer() {
    this.renderer = new ENGINE.PIXI.Application({ resizeTo: window, ...this.projectConfig.rendering.application });
    document.body.appendChild(this.renderer.view);
    globalThis.__PIXI_APP__ = this.renderer;
  }

  initializeScriptEnvironment() {
    this.scriptEnvironment = {
      ...ENGINE,
      renderer: this.renderer
    }
  }

  executeProjectScript() {
    const projectScriptFunction = eval(`(async function () {\n${this.projectScript}\n})`);
    runWithAsync(this.scriptEnvironment, projectScriptFunction);
  }

  static async load(projectPath) {
    const runner = new Runner(projectPath);

    await runner.initialize();
    await runner.initializeRenderer();
    runner.initializeScriptEnvironment();
    runner.executeProjectScript();
    
    return runner;
  }
}
