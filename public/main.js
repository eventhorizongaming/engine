import { Runner } from "./lib";

const projectRunner = await Runner.load('./project/')
projectRunner.start();
