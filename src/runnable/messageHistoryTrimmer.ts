import { trimMessages } from "@langchain/core/messages";
import { MESSAGE_HISTORY_KEY } from "../util/constants.js";
import { RunnablePassthrough } from "@langchain/core/runnables";

// create a trim function, to be used as a runnable
const trimmerFunction = trimMessages({
  maxTokens: 1000,  // trim the history to 1000 tokens
  tokenCounter: (messages) => messages.length * 50,  // assume each message is of size 50 tokens, so allowed messages = 1000 (maxtokens) / 50 (tokens per message) = 20 messages
  strategy: "last",  // trim the last n messages,
  includeSystem: true,
  startOn: "human",
  endOn: "human" // always start on human message
});

// create a trimming runnable
export const trimmingRunnable = RunnablePassthrough.assign({
  // This ensures the "MESSAGE_HISTORY_KEY" key is trimmed BEFORE it hits the prompt
  [MESSAGE_HISTORY_KEY]: async (input: any) => trimmerFunction.invoke(input[MESSAGE_HISTORY_KEY]),
})