import fs from 'fs/promises'
import { Pool } from 'pg'
import { SERVER_CONFIG } from '../config/server.config'

let client: Pool | undefined
export function getClient() {
  if (!client) {
    return buildClient()
  }
  return client
}

export async function ensureDbConnection() {
  const c = await getClient().connect()
  c.release()
}

export function closeDbConnection() {
  client?.end()
  console.info('Closed DB connection.')
}


function buildClient() {
  return new Pool({
    host: SERVER_CONFIG.db.host,
    port: SERVER_CONFIG.db.port,
    user: SERVER_CONFIG.db.user,
    password: SERVER_CONFIG.db.password,
    database: SERVER_CONFIG.db.database,
  })
}

export async function initializeDatabase(): Promise<void> {
  const files = await fs.readdir('db-init')
  console.info('Initializing DB with the following:\n')
  for (const file of files) {
    const sql = await fs.readFile('db-init/' + file, 'utf8')
    console.info(sql)
    await getClient().query(sql)
  }
  console.info('Finished DB initialization.')
}
