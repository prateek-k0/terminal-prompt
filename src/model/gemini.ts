import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

export const modelGemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: parseInt(process.env.GEMINI_OUTPUT_TOKENS ?? "2048"),
  temperature: 0.66,
});