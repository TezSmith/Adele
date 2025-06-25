import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export interface Message {
  text: string
  uuid: string
  timestamp: number
}

export interface StarterMessage {
  id: number
  text: string
}

export const useWebSocketStore = defineStore('websocket', () => {
  const socket = ref<WebSocket | null>(null)
  const messages = ref<Message[]>([])
  const starterMessages = ref<StarterMessage[]>([])
  const isConnected = ref(false)
  const backendHealthy = ref(false)
  const errorMessage = ref('')
  const uuid = ref(uuidv4())

  async function checkBackend() {
    errorMessage.value = ''
    try {
      const res = await axios.get('http://localhost:3000/health')
      if (res.status === 200 && res.data.status === 'OK') {
        console.info('Backend is healthy.')
        backendHealthy.value = true
      } else {
        console.info(
          `Backend check failed, response code was ${res.status}, data was ${JSON.stringify(res.data)}`,
        )
        setTimeout(checkBackend, 10000)
      }
    } catch {
      console.info('Backend not healthy yet, retrying.')
      errorMessage.value = 'backend not healthy yet, retrying'
      setTimeout(checkBackend, 10000)
    }
  }

  function connect() {
    errorMessage.value = ''

    if (socket.value?.readyState !== WebSocket.OPEN) {
      socket.value = new WebSocket('ws://localhost:3000/ws')

      socket.value.onopen = () => {
        isConnected.value = true
        console.info('Connected to WebSocket server.')
      }

      socket.value.onmessage = async (event) => {
        try {
          const parsedData = JSON.parse(event.data)

          if (parsedData) {
            if (parsedData.type === 'starter') {
              starterMessages.value = parsedData.starters;
            } else if (parsedData.type === 'history') {
              messages.value = parsedData.messages.reverse()
            } else {
              messages.value.push(parsedData)
            }
          }


        } catch (error) {
          console.error('Error processing message:', error)
          errorMessage.value = 'Error processing message.'
        }
      }

      socket.value.onclose = () => {
        isConnected.value = false
        console.info('Disconnected from WebSocket server.')
        console.info('Attempting to reconnect shortly.')
        setTimeout(connect, 1000)
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
        errorMessage.value = 'WebSocket connection error'
      }
    }
  }

  function disconnect() {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.close()
    }
  }

  function sendMessage(text: string) {
    if (socket.value?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        text,
        uuid: uuid.value,
      })
      socket.value.send(message)
    }
  }

  function startChat(text: string) {
    if (socket.value?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        text,
        uuid: uuid.value,
      })
      starterMessages.value = []
      socket.value.send(message)
    }
  }

  function addMessage(text: string) {
    const message: Message = {
      text,
      uuid: 'coach',
      timestamp: Date.now(),
    }
    messages.value.push(message)
  }

  onMounted(() => {
    checkBackend()
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    messages,
    starterMessages,
    errorMessage,
    backendHealthy,
    uuid,
    connect,
    disconnect,
    sendMessage,
    startChat,
    addMessage
  }
})
