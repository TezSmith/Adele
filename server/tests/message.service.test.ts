import {mocked} from 'jest-mock'
import * as MessageService from '../services/message.service'
import * as Repo from '../repositories/messages.repo'

jest.mock('../sql/messages.queries')
const mockedRepo = mocked(Repo)

describe('saveMessage', () => {
  test('returns a formatted ChatMessage when message successfully saved', async () => {
    const text = 'hi there!'
    const senderId = 'abc123'
    const createdAt = new Date()

    mockedRepo.insertMessage.mockResolvedValue({
      id: 1,
      content: text,
      sender_id: senderId,
      created_at: createdAt
    })

    const result = await MessageService.saveMessage(
      text,
      senderId
    )

    expect(result.text).toBe(text)
    expect(result.uuid).toBe(senderId)
    expect(result.timestamp).toBe(createdAt.getTime())
  })

  test('throws an error if the ChatMessage was not successfully saved', async () => {
    mockedRepo.insertMessage.mockResolvedValue(undefined)

    await expect(
      MessageService.saveMessage('this is my message', 'def456')
    ).rejects.toThrow()
  })
})
