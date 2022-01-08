import {
  CommandHandler,
  useDescription,
  createElement,
  Message,
  useString,
} from "slshx";

// `Env` contains bindings and is declared in types/env.d.ts
export function play(): CommandHandler<Env> {
  useDescription("Plays a meme");
  const meme = useString("meme", "Name of meme", { required: true });
  return async (interaction, env, ctx) => {
    let id = env.DO.idFromName("A");
    let stub = env.DO.get(id);
    let response: Response = await stub.fetch(
      new Request("https://arjunchib.com/")
    );
    return (
      <Message ephemeral>
        {meme}
        {await response.text()}
      </Message>
    );
  };
}
