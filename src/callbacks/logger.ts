import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

export class Logger extends BaseCallbackHandler {
  name = "Logger";
  async handleLLMStart(llm: any, propmts: string[], runId: string) {
    console.log('LLM started');
  }
  async handleLLMEnd(output: any, runId: string) {
    console.log('LLM ended');
  }
  async handleLLMError(error: any, runId: string) {
    console.log('LLM error');
  }
  async handleLLMStream(stream: any, runId: string) {
    console.log('LLM stream');
  }
  async handleChainStart(chain: any, inputs: any, runId: string) {
    console.log('Chain started');
  }
  async handleChainEnd(output: any, runId: string) {
    console.log('Chain ended');
  }
  async handleChainError(error: any, runId: string) {
    console.log('Chain error');
  }
  async handleChainStream(stream: any, runId: string) {
    console.log('Chain stream');
  }
}