/**
 * Takes an input environment object and executes the input function with the values from the environment.  Replacement for the JavaScript "with"
 * @param {object} env The input environment to execute the function with
 * @param {function} func The function to execute
 */
export function runWith(env, func) {

  // Transpile the input function into a function with newer parameters
  const functionString = func.toString();
  const functionBody = functionString.slice(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"));
  const newFunctionParams = `{ ${Object.keys(env).join(', ')} }`;
  const newFunctionString = `function (${newFunctionParams}) {${functionBody}}`
  const newFunction = eval(`(${newFunctionString})`);

  // Execute the transpiled function
  newFunction(env);
}