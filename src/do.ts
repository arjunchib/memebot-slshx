import { call, getBearerAuth } from "slshx";

export class DurableObjectExample {
  heartbeat_interval = 0;
  ws: WebSocket | undefined;
  s: number | null = null;

  constructor(state, env) {}

  async fetch(request) {
    // let { url } = await call("GET", "/gateway");
    if (!this.ws) {
      this.websocket("https://gateway.discord.gg/?v=9&encoding=json");
    }
    return new Response();
  }

  async websocket(url: string) {
    // Make a fetch request including `Upgrade: websocket` header.
    // The Workers Runtime will automatically handle other requirements
    // of the WebSocket protocol, like the Sec-WebSocket-Key header.
    let resp = await fetch(url, {
      headers: {
        Upgrade: "websocket",
      },
    });

    // If the WebSocket handshake completed successfully, then the
    // response has a `webSocket` property.
    let ws = resp.webSocket;
    if (!ws) {
      throw new Error("server didn't accept WebSocket");
    }
    this.ws = ws;

    // Call accept() to indicate that you'll be handling the socket here
    // in JavaScript, as opposed to returning it on to a client.
    ws.accept();

    // Now you can send and receive messages like before.
    ws.addEventListener("message", (msg) => {
      let data = JSON.parse(msg.data as string);
      console.log(data);
      this.s = data.s;
      switch (data.op) {
        case 10:
          this.heartbeat_interval = data.d.heartbeat_interval;
          setTimeout(
            () => this.heartbeat(),
            this.heartbeat_interval * Math.random()
          );
          this.identify();
          break;
      }
    });
  }

  identify() {
    let payload = {
      op: 2,
      d: {
        token: SLSHX_APPLICATION_BOT_TOKEN,
        intents: 513,
        properties: {
          $os: "linux",
          $browser: "my_library",
          $device: "my_library",
        },
      },
    };
    this.ws?.send(JSON.stringify(payload));
  }

  heartbeat() {
    this.ws?.send(JSON.stringify({ op: 1, d: this.s }));
    setTimeout(() => this.heartbeat(), this.heartbeat_interval);
  }
}
