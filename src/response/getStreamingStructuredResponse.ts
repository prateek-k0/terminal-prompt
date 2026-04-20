import readline from "readline";

/*
for streaming structured response, use streamEvents() instead of stream()
spits out events like:

on_chat_model_start: Great for showing a "Thinking..." indicator.
on_chat_model_stream: Where the actual text/JSON chunks live.
on_chain_end: Great for showing a "Done!" indicator.
on_tool_start: (Useful later for RAG) to show which document the AI is looking up.
*/
export async function getStreamingStructuredResponse(promptInput: string, model: any, rl: readline.Interface) {
  rl.write("\n\n-------------Before prompt----------------\n\n");
  // use version 'v2' for structured response
  const responseStream = model.streamEvents({ input: promptInput }, { version: 'v2' }); 
  await responseStream.pipeTo(new WritableStream({
    write: (eventChunk) => {
      const { event } = eventChunk;
      switch(event) {
        case "on_chat_model_start": 
          rl.write('Thinking ...\n');
          break;
        case "on_chat_model_stream":
          if(eventChunk.data.chunk) {
            rl.write(eventChunk.data.chunk?.content?.toString() ?? '');
          }
          break;
        case "on_chain_end":
          // rl.write('Done!');
          // rl.write('Final output: ' + JSON.stringify(eventChunk.data.output, null, 2));
          break;
        default:
          // console.log('Unknown event chunk received:', eventChunk);
          break;
      }
    }, 
    close: () => {
      rl.write("\n\n-------------prompt finished----------------\n\n");
    },
    abort: (err) => {
      console.error(err);
    }
  }))
}