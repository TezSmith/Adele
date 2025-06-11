import * as Repo from '../repositories/conversation-starters.repo'

type ConvoMessage = {
  id: Number;
  text: String;
}

export async function getConversationStarters(): Promise<ConvoMessage[]> {
  const messages = await Repo.getConversationStarters()
  return messages.map((msg) => {
    return {
      id: msg.id,
      text: msg.content
    }
  })
}