/**
 * A WebSocket test client to echo back the messages.
 *
 * Use in local development to help simulate receiving messages 
 * from another pup parent.
 */
import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'

const uuid = uuidv4()
let ws: WebSocket | null = null
let reconnectTimer: NodeJS.Timeout | null = null
let pingTimer: NodeJS.Timeout | null = null

// Wait a few seconds for the WebSocket server to boot up.
setTimeout(() => {
  connect()
}, 3000)

function connect() {
  if (ws) {
    ws.removeAllListeners()
    ws.close()
  }
  if (pingTimer) {
    clearInterval(pingTimer)
  }
  reconnectTimer = null

  ws = new WebSocket('ws://localhost:3000/ws')

  ws.on('open', () => {
    if (!ws) return
    console.info('Connected WebSocket test client.')
  })

  ws.on('message', (data) => {
    console.info('Received:', data.toString())
    
    try {
      const message = JSON.parse(data.toString())
      
      if (message.uuid && message.uuid !== uuid) {
        if (!ws) return
        
        setTimeout(() => {
          ws?.send(JSON.stringify({ 
            text: `Responding to: ${message.text}`,
            uuid 
          }))
        }, 1000)
      }
    } catch (err) {
      console.error('Failed to parse message:', err)
    }
  })

  ws.on('close', () => {
    ws = null
    if (pingTimer) {
      clearInterval(pingTimer)
    }
    console.info('Disconnected WebSocket test client. Attempting to reconnect shortly.')
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(connect, 2000)
    }
  })

  ws.on('error', (err) => {
    console.error('Error with WebSocket test client: ', err)
  })
}

function shutdown() {
  console.info('Shutting down WebSocket test client.')
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }
  if (pingTimer) {
    clearInterval(pingTimer)
  }
  if (ws) {
    ws.close()
  }
  process.exit(0)
}

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, shutdown.bind(signal))
})
