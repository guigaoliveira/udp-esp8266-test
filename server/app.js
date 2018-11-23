const dgram = require('dgram')
const WebSocket = require('ws')
const udpServer = dgram.createSocket('udp4')

const WS_PORT = 8000

const UDP_PORT = 41234

const wss = new WebSocket.Server({
  port: WS_PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    clientMaxWindowBits: 10, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed.
  },
})

wss.broadcast = data =>
  wss.clients.forEach(client => client.readyState === WebSocket.OPEN && client.send(data))

udpServer.on('error', err => {
  console.log(`server error:\n${err.stack}`)
  udpServer.close()
})

udpServer.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  wss.broadcast(msg.toString())
})

udpServer.on('listening', () => console.log(`udp server listening in port ${UDP_PORT}`))

udpServer.bind(UDP_PORT)

wss.on('connection', ws => console.log(ws.client))

wss.on('listening', () => console.log(`ws server listening in port ${WS_PORT}`))
