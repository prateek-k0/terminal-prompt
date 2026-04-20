import { z } from "zod";

// for structured response, use zod schema to parse the response
export const responseSchema = z.object({
  title: z.string().describe('The title of the response'),
  description: z.string().describe('The description of the response'),
  explanation: z.string().describe('The explanation of the response'),
  example: z.string().describe('An example to explain the response'),
  summary: z.string().describe('A summary of the response'),
}).describe('A structured response with a title, description, explanation, example, and summary');