import * as Repo from '../repositories/messages.repo'

export type ChatMessage = {
  text: string
  uuid: string
  timestamp: number
}

export async function saveMessage(
  text: string,
  senderId: string
): Promise<ChatMessage> {
  const result = await Repo.insertMessage(text, senderId)
  if (!result) {
    throw new Error('Unable to save message.')
  }
  return formatMessage(result)
}

export async function getRecentMessages(): Promise<ChatMessage[]> {
  const messages = await Repo.getRecentMessages()
  return messages.map(formatMessage)
}

function formatMessage(rawMessage: Repo.Message): ChatMessage {
  return {
    text: rawMessage.content,
    uuid: rawMessage.sender_id,
    timestamp: rawMessage.created_at.getTime()
  }
}
