export async function createWebsocket(url: string) {
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

  // Call accept() to indicate that you'll be handling the socket here
  // in JavaScript, as opposed to returning it on to a client.
  ws.accept();

  return ws;
}
