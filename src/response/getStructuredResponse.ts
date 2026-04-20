import readline from "readline";

export async function getStructuredResponse(promptInput: string, model: any, rl: readline.Interface) {
  rl.write("\n\n-------------Before prompt----------------\n\n");
  const response = await model.invoke({ input: promptInput });
  rl.write("Response:");
  rl.write(JSON.stringify(response, null, 2));
  rl.write("\n\n-------------prompt finished----------------\n\n");
}