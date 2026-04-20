import readline from "readline";
export async function getPromptResponseText(promptInput: string, model: any, rl: readline.Interface, config: any) {
  rl.write("\n\n-------------Before prompt----------------\n\n");
  const responseStream = await model.stream({
    input: promptInput, // pass the prompt input to the chain
  }, config ?? {});
  rl.write("Response:");

  // use either of the following approaches for a streaming text response
  // for-await loop
  // try {
  //   for await (const chunk of responseStream) {
  //     rl.write(chunk.content.toString());
  //   }
  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   rl.write("\n\n-------------prompt finished----------------\n\n");
  // }

  // for writeableStream,s use pipeTo() with await to see if the stream is completed (or errored)
  // and allow for next prompt to be run
  await responseStream.pipeTo(new WritableStream({
    write: (chunk) => { // when using StingParser, the chunk is a string
      rl.write(chunk);
    },
    close: () => {
      rl.write("\n\n-------------prompt finished----------------\n\n");
    },
    abort: (err) => {
      console.error(err);
    }
  }))
}