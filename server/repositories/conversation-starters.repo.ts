import { getClient } from '../services/database.service'
import * as pg from './types/conversation-starters.pgqueries'

export type ConversationStarterMessage = {
  id: number,
  content: string
}

export async function getConversationStarters(
): Promise<ConversationStarterMessage[]> {
  return pg.getConversationStarters.run(undefined, getClient())
}
