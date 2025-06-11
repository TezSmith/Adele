import { getClient } from '../services/database.service'
import * as pg from './types/messages.pgqueries'

export type Message = {
  id: number,
  content: string,
  sender_id: string,
  created_at: Date
}

export async function insertMessage(
  content: string,
  senderId: string
): Promise<Message | undefined> {
  const result = await pg.insertMessage.run(
    { content, senderId },
    getClient()
  )
  if (result.length) {
    return result[0]
  }
}

export async function getRecentMessages(
  limit: number = 50
): Promise<Message[]> {
  return pg.getRecentMessages.run(
    { limit },
    getClient()
  )
}
