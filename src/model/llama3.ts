import { ChatOllama } from "@langchain/ollama";
import "dotenv/config";
import { responseSchema } from "../schema/responseSchema.js";
import { MESSAGE_HISTORY_KEY, INPUT_KEY } from "../util/constants.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { StringOutputParser } from "@langchain/core/output_parsers";
// for using trimmer
import { trimmingRunnable } from "../runnable/messageHistoryTrimmer.js";
// for using summarizer
import { messageHistorySummarizerRunnable } from "../runnable/messageHistorySummarizer.js";

// locally running llm model
const model = new ChatOllama({
  model: "llama3.1",
  // temperature: 0, // set temperature to 0 for structured response
  temperature: 0.7,
  streaming: true,  // set streaming to true for streaming response
  baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
});

// set system prompts
// for memory, use MessagesPlaceholder
const systemPrompts = ChatPromptTemplate.fromMessages([
  ["system", "You are a local AI running on a dev's machine, you are fast and helpful. Provide a verbose response with the necessary details."],
  new MessagesPlaceholder(MESSAGE_HISTORY_KEY),  // pasing the variable name for the chat history
  ["human", `{${INPUT_KEY}}`],
]);

// create a chain (without trimming)
const chain = RunnableSequence.from([systemPrompts, model]);
// or use pipe() instead of RunnableSequence.from
// const chain = systemPrompts.pipe(model);

/*  Create a chain with trimming
const chainWithTrimming = RunnableSequence.from([trimmingRunnable, systemPrompts, model]);
*/

// Create a chain with summarization
const chainWithSummarization = RunnableSequence.from([
  messageHistorySummarizerRunnable,
  systemPrompts,
  model
]);

// a simple map to store message histories by session id
const messageHistoryMap = new Map<string, InMemoryChatMessageHistory>();

// create another chain, now including the memory
const chainWithMemoryHistory = RunnableSequence.from([
  new RunnableWithMessageHistory({
    // runnable: chainWithTrimming,
    runnable: chainWithSummarization,
    getMessageHistory: (sessionId: string) => {
      if(!messageHistoryMap.has(sessionId)) {
        messageHistoryMap.set(sessionId, new InMemoryChatMessageHistory());
      }
      return messageHistoryMap.get(sessionId)!;
    },
    inputMessagesKey: INPUT_KEY,  // same as the input messages key in the system prompts
    historyMessagesKey: MESSAGE_HISTORY_KEY,  // same as the messages placeholder key in the system prompts
  }), 
  new StringOutputParser()  // parse the output to a string
]);

export const modelOllama = model;
export const modelWithMemory = chainWithMemoryHistory
// use the schema
export const modelOllamaStructuredWithMemory = model.withStructuredOutput(responseSchema);