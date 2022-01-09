import {
  CommandHandler,
  useDescription,
  createElement,
  Message,
  useString,
} from "slshx";
import { Env } from "../types/env";

// `Env` contains bindings and is declared in types/env.d.ts
export function play(): CommandHandler<Env> {
  useDescription("Plays a meme");
  const meme = useString("meme", "Name of meme", { required: true });
  return async (interaction, env, ctx) => {
    let id = env.DO.idFromName("A");
    let stub = env.DO.get(id);
    let response: Response = await stub.fetch(
      new Request("https://arjunchib.com/", {
        method: "POST",
        body: JSON.stringify({
          name: meme,
          guild: interaction.guild_id,
          channel: "213484561127047169",
        }),
      })
    );
    return (
      <Message ephemeral>
        {meme}
        {await response.text()}
      </Message>
    );
  };
}
