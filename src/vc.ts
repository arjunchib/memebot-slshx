import { createWebsocket } from "./ws";

export class VoiceConnection {
  session_id: string | undefined;
  user_id: string | undefined;
  server_id: string | undefined;
  token: string | undefined;
  ws: WebSocket | undefined;

  async connect(endpoint: string) {
    this.ws = await createWebsocket(`https://${endpoint}`);
    this.ws.addEventListener("message", (msg) =>
      console.log(JSON.parse(msg.data as string))
    );
    let payload = {
      op: 0,
      d: {
        server_id: this.server_id,
        user_id: this.user_id,
        session_id: this.session_id,
        token: this.token,
      },
    };
    console.log(payload);
    this.ws?.send(JSON.stringify(payload));
  }
}
