import { VoiceConnection } from "./vc";
import { createWebsocket } from "./ws";

export class DurableObjectExample {
  heartbeat_interval = 0;
  ws: WebSocket | undefined;
  s: number | null = null;
  voice_connections: Map<string, VoiceConnection> = new Map();

  constructor(state: any, env: any) {}

  async fetch(request: any) {
    // let { url } = await call("GET", "/gateway");

    let ctx = await request.json();
    if (!this.ws) {
      this.ws = await createWebsocket(
        "https://gateway.discord.gg/?v=9&encoding=json"
      );
      this.ws.addEventListener("message", (msg) =>
        this.handleMessage(msg, ctx)
      );
    } else {
      this.play(ctx);
    }
    return new Response();
  }

  identify() {
    let payload = {
      op: 2,
      d: {
        token: SLSHX_APPLICATION_BOT_TOKEN,
        intents: 128,
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

  handleEvent(event: any, ctx: any) {
    switch (event.t) {
      case "READY":
        this.play(ctx);
        break;
      case "VOICE_STATE_UPDATE": {
        let vc = new VoiceConnection();
        vc.user_id = event.d.user_id;
        vc.session_id = event.d.session_id;
        vc.server_id = event.d.guild_id;
        this.voice_connections.set(ctx.guild, vc);
        break;
      }
      case "VOICE_SERVER_UPDATE": {
        let vc = this.voice_connections.get(ctx.guild);
        if (vc) {
          vc.token = event.d.token;
          vc.connect(event.d.endpoint);
        }
        break;
      }
    }
  }

  handleMessage(msg: any, ctx: any) {
    let data = JSON.parse(msg.data as string);
    console.log(data);
    this.s = data.s;
    switch (data.op) {
      case 0:
        this.handleEvent(data, ctx);
        break;
      case 10:
        this.heartbeat_interval = data.d.heartbeat_interval;
        setTimeout(
          () => this.heartbeat(),
          this.heartbeat_interval * Math.random()
        );
        this.identify();
        break;
    }
  }

  play(ctx: any) {
    if (this.voice_connections.has(ctx.guild)) {
      return;
    }
    let payload = {
      op: 4,
      d: {
        guild_id: ctx.guild,
        channel_id: ctx.channel,
        self_mute: false,
        self_deaf: false,
      },
    };
    this.ws?.send(JSON.stringify(payload));
  }
}
