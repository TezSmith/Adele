import { WebSocketServer, RawData } from 'ws'
import { Server } from 'http'
import { ExtendedWebSocket } from '../types/websocket'

import * as MessageService from './message.service'
import * as ConversationStarterService from './conversation-starters.service'

const PONG_WAIT = 60000
const PING_PERIOD = Math.floor(PONG_WAIT * 0.9)
const MAX_MESSAGE_SIZE = 512

export function setupWebSocketServer(
  server: Server
): {
  wss: WebSocketServer,
  clients: Set<ExtendedWebSocket>,
  heartbeatInterval: NodeJS.Timeout,
  shutdown: () => void
} {
  const wss = new WebSocketServer({
    server,
    maxPayload: MAX_MESSAGE_SIZE
  })
  const clients = new Set<ExtendedWebSocket>()

  wss.on('connection', async (ws: ExtendedWebSocket) => {
    ws.isAlive = true
    clients.add(ws)

    try {
     await handleInitialConnection(ws)

    } catch (error) {
      console.error('Error sending message history:', error)
    }

    ws.on('pong', () => { ws.isAlive = true })

    ws.on('message', async (data: RawData) => {
      try {
        await handleIncomingMessage(data, clients)
      } catch (error) {
        console.error('Error processing message:', error)
        ws.terminate()
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
    })

    ws.on('error', () => {
      clients.delete(ws)
      ws.terminate()
    })
  })

  const heartbeatInterval = setInterval(() => {
    clients.forEach(ws => {
      if (ws.isAlive === false) {
        clients.delete(ws)
        ws.terminate()
        return
      }
      ws.isAlive = false
      ws.ping()
    })
  }, PING_PERIOD)

  const shutdown = () => {
    clearInterval(heartbeatInterval)
    clients.forEach(ws => ws.close())
    clients.clear()
    wss.close()
    console.info('Closed WebSocket connections.')
  }

  return { wss, clients, heartbeatInterval, shutdown }
}

function broadcast(clients: Set<ExtendedWebSocket>, message: string): void {
  clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

async function handleInitialConnection(
  ws: ExtendedWebSocket,
): Promise<void> {
  const messages = await MessageService.getRecentMessages()
  if (messages.length === 0) {
    const starters = await ConversationStarterService.getConversationStarters()
    ws.send(JSON.stringify({ type: 'starter', starters }))
  } else {
    ws.send(JSON.stringify({ type: 'history', messages}))
  }
}

async function handleIncomingMessage(
  data: RawData,
  clients: Set<ExtendedWebSocket>
): Promise<void> {
  const message = JSON.parse(data.toString())
  const savedMessage = await MessageService.saveMessage(message.text, message.uuid)
  broadcast(clients, JSON.stringify(savedMessage))
}
