import { AgentAction } from "@langchain/core/agents";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { RunnableLambda } from "@langchain/core/runnables";
import { BaseMessage } from "langchain";
import { Serialized } from "langchain/load/serializable";

const dummyLambda = RunnableLambda.from(async (input: any) => {
  return `The input is: ${input}`;
})

class MyCustomHandler extends BaseCallbackHandler {
  name = "MyCustomHandler";

  async handleLLMStart(chain: any) {
    console.log('LLM started');
  }
  async handleLLMEnd(output: any) {
    console.log('LLM ended');
  }
  async handleLLMError(error: any) {
    console.log('LLM error');
  }
  async handleLLMStream(stream: any) {
    console.log('LLM stream');
  }
  async handleToolStart(tool: any) {
    console.log('Tool started');
  }
  async handleToolEnd(output: any) {
    console.log('Tool ended');
  }
  async handleToolError(error: any) {
    console.log('Tool error');
  }
  async handleChainStart(chain: any) {
    console.log('Chain started', chain);
  }
  async handleChainEnd(output: any) {
    console.log('Chain ended', output);
  }
  async handleChainError(error: any) {
    console.log('Chain error');
  }
  async handleChainStream(stream: any) {
    console.log('Chain stream');
  }
  async handleAgentAction(action: AgentAction, runId: string, parentRunId?: string, tags?: string[]): Promise<void> {
    console.log('Agent action', action);
  }
  async handleAgentEnd(output: any) {
    console.log('Agent ended', output);
  }
  async handleAgentError(error: any) {
    console.log('Agent error', error);
  }
  async handleAgentStream(stream: any) {
    console.log('Agent stream', stream);
  }
  async handleChatModelStart(llm: Serialized, messages: BaseMessage[][], runId: string, parentRunId?: string, extraParams?: Record<string, unknown>, tags?: string[], metadata?: Record<string, unknown>, runName?: string) {
    console.log('Chat model started', llm, messages, runId, parentRunId, extraParams, tags, metadata, runName);
  }
  async handleCustomEvent(eventName: string, data: any, runId: string, tags?: string[], metadata?: Record<string, any>) {
    console.log('Custom event', eventName, data, runId, tags, metadata);
  }
  async handleText(text: string) {
    console.log('Text', text);
  }
  async handleTextStream(stream: any) {
    console.log('Text stream', stream);
  }
  async handleRetrieverStart(retriever: any) {
    console.log('Retriever started', retriever);
  }
  async handleRetrieverEnd(output: any) {
    console.log('Retriever ended', output);
  }
  async handleRetrieverError(error: any) {
    console.log('Retriever error', error);
  }
  async handleRetrieverStream(stream: any) {
    console.log('Retriever stream', stream);
  }
}

dummyLambda.invoke("Hello, world!", {
  callbacks: [new MyCustomHandler()]
}).then((result) => {
  console.log(result);
});