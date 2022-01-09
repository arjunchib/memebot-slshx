# Memebot on Cloudflare Workers

Memebot is a discord bot that downloads audio from youtube and can be played back on a voice channel using slash commands.

This is built using [Slshx](https://github.com/mrbbot/slshx), a react-like framework for discord interactions on Cloudflare.
This project attempts to create a gateway and voice connections for a bot using a durable object. Currently development on this is suspended until Cloudflare implments [UDP sockets on workers](https://blog.cloudflare.com/introducing-socket-workers/), which is needed for streaming audio to discord.

## Geting started

1. Clone the repo

   ```
   git clone https://github.com/arjunchib/memebot-slshx.git
   cd memebot-slshx
   ```

2. Install dependencies

   ```
   pnpm i
   ```

3. Setup tunnel in a terminal

   ```
   cloudflared tunnel --hostname <hostname> --url localhost:8787 --name memebot
   ```

4. Run dev server in another terminal

   ```
   pnpm dev
   ```
