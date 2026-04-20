import readline from "readline";
import "dotenv/config";
import { getPromptResponseText } from "./src/response/getPromptResponseText.js";
// import { getStructuredResponse } from "./src/response/getStructuredResponse.js";
// import { getStreamingStructuredResponse } from "./src/response/getStreamingStructuredResponse.js";
import { modelWithMemory } from "./src/model/llama3.js";


// Initialize the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chainWithMemoryHistory = modelWithMemory;

async function runner(sessionId: string) {
  // await summarizeMessages(sessionId);
  const config = { configurable: { sessionId } };
  rl.question("Enter a prompt: ", async (promptInput) => {
    await getPromptResponseText(promptInput, chainWithMemoryHistory, rl, config);
    // await getStructuredResponse(promptInput, chain, rl);
    // await getStreamingStructuredResponse(promptInput, chain, rl);
    // loop until user exits
    runner(sessionId);
  });
}

runner('session1');
