import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";
import { ToolMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";

const weatherTool = tool(
  // config looks like: { configurable: { ... } }
  async ({ location }, config: any) => {
    // Logic to fetch weather
    return `The weather in ${location} is 28°C and sunny.`;
  },
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    schema: z.object({
      location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    }),
  }
);

const model = new ChatOllama({
  model: "llama3.1",
  // temperature: 0, // set temperature to 0 for structured response
  temperature: 0.7,
  streaming: true,  // set streaming to true for streaming response
  baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
});
const modelWithTools = model.bindTools([weatherTool]);

// 1. Get the model's request
const response = await modelWithTools.invoke("What is the weather in Paris?");
console.log('tool_calls: ', response.tool_calls);

// 2. Need to manually call the tool
const toolOutputs = await Promise.all((response.tool_calls ?? [])?.map(async (call) => {
  // Call your function with the generated args
  const result = await weatherTool.invoke(call.args);
  // 3. Create the ToolMessage
  return new ToolMessage({
    content: result,
    tool_call_id: call.id, // Mandatory: links the result to the request
  })
}));
console.log('toolOutputs: ', toolOutputs);

// 4. Send everything back to the model for the final summary
const finalResponse = await modelWithTools.invoke([
  ["user", "What is the weather in Paris?"],
  response,           // The original tool call request
  ...toolOutputs   // The actual data from the tool
]);

// steps 2 and 3 are done automatically in langgraph, which is why we don't use them with models

console.log(finalResponse.content);