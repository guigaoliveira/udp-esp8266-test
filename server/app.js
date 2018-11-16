const dgram = require("dgram");
const udpServer = dgram.createSocket("udp4");
const WebSocket = require("ws");
const wss = new WebSocket.Server({
  port: 8000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    clientMaxWindowBits: 10, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

udpServer.on("error", err => {
  console.log(`server error:\n${err.stack}`);
  udpServer.close();
});

udpServer.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  wss.broadcast(msg);
});

udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

udpServer.bind(41234);

wss.on("connection", ws => {
  console.log(ws.client);
});
