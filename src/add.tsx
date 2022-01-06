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
  return (interaction, env, ctx) => <Message ephemeral>{meme}</Message>;
}
