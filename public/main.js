import { Runner } from "./lib";

const projectRunner = await Runner.load('./project/')
document.body.appendChild(projectRunner.canvas);
projectRunner.start();
