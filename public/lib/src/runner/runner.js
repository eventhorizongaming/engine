import * as ENGINE from '../../index'
import { loadJSON } from "../util/loaders/jsonLoader";
import { loadText } from "../util/loaders/textLoader";
import { runWithAsync } from '../util/with';

export class Runner {
  projectPath;
  projectConfig;
  projectScript;

  constructor(projectPath) {
    this.projectPath = projectPath;
  }

  async initialize() {
    this.projectConfig = await loadJSON(this.projectPath + 'config.json');
    this.projectScript = await loadText(this.projectPath + 'main2.js');
    console.log(this.projectScript);
  }

  executeProjectScript() {
    const projectScriptFunction = eval(`(async function () {\n${this.projectScript}\n})`)

    runWithAsync(ENGINE, projectScriptFunction);
  }

  static async load(projectPath) {
    const runner = new Runner(projectPath);
    await runner.initialize();
    runner.executeProjectScript();
    
    return runner;
  }
}
