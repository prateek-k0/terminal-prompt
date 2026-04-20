import { MESSAGE_HISTORY_KEY } from "../util/constants.js";
import { ChatOllama } from "@langchain/ollama";
import { SystemMessage } from "@langchain/core/messages";
import { RunnablePassthrough } from "@langchain/core/runnables";

async function summarizeMessages(messageHistory: any[]) {
  // 1. Ensure history is an array and has content
  if (!Array.isArray(messageHistory) || messageHistory.length < 5) {
    return messageHistory;
  }

  // Force temperature to 0 for strict summarization
  const summarizer = new ChatOllama({
    model: "llama3",
    temperature: 0, // Consistent, factual responses
    // Add this to prevent 'infinite thinking' or empty streams
    repeatPenalty: 1.2,
  });

  try {
    // 2. CONVERT messages to a single string for the local model.
    // Small local models summarize better when given a "transcript" format.
    const transcript = messageHistory
      .map((m) => `${m._getType() === "human" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const response = await summarizer.invoke([
      [
        "system",
        "Summarize the following chat transcript concisely. Focus on facts. Output ONLY the summary text.",
      ],
      ["human", `Transcript:\n${transcript}`],
    ]);

    // 3. Robust content extraction
    const summaryText = response.content?.toString().trim();

    if (!summaryText) {
      console.warn("⚠️ Summary was empty. Keeping original history.");
      return messageHistory;
    }

    console.log("✅ Summary Created:", summaryText);

    // Return the new 'Summary' as a System Message to reset context
    return [new SystemMessage(`This is a summary of the conversation so far: ${summaryText}`)];
  } catch (error) { // if error, return original history
    console.error("❌ Summarization Error:", error);
    return messageHistory;
  }
}

// create a runnable to summarize the message history
export const messageHistorySummarizerRunnable = RunnablePassthrough.assign({
  [MESSAGE_HISTORY_KEY]: async (input: any) => await summarizeMessages(input[MESSAGE_HISTORY_KEY])
});
