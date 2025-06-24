import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { setupWebSocketServer } from './services/websocket.service'
import { ensureDbConnection, closeDbConnection, initializeDatabase } from './services/database.service'
import { SERVER_CONFIG } from './config/server.config'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import healthRoutes from './routes/health.routes'
import coachRoutes from './routes/coach.routes'

try {
  run()
} catch {
  console.error('FAILED TO SETUP SERVER.')
  process.exit(1)
}

async function run() {
  const app = express()
  const server = createServer(app)

  const { shutdown: shutdownWs } = setupWebSocketServer(server)

  await ensureDbConnection()
  await initializeDatabase()

  app.use(cors(SERVER_CONFIG.cors))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/health', healthRoutes)
  app.use('/coach', coachRoutes)
  app.use(notFoundHandler)
  app.use(errorHandler)

  server.listen(SERVER_CONFIG.port, () => {
    console.info(`Server running on port ${SERVER_CONFIG.port}.`)
    console.info(`WebSocket server is ready.`)
  })

  let isShuttingDown = false
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return
    isShuttingDown = true

    console.info(`Received ${signal}, initiating shutdown.`)
    shutdownWs()
    closeDbConnection()

    server.close(() => {
      process.exit(0)
    })
  }

  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, shutdown.bind(signal))
  })
}
