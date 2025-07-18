<template>
  <v-snackbar v-model="showError" :timeout="6000" multi-line location="top" color="error">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" @click="showError = false">Close</v-btn>
    </template>
  </v-snackbar>

  <v-sheet
    class="pa-4 d-flex flex-column justify-space-between"
    style="height: calc(100vh - 192px)"
    elevation="1"
  >

    <div v-if="!isConnected" class="text-subtitle-2 text-grey mb-2 text-center">
      🔄 Connecting to chat...
    </div>

    <div class="messages-container flex-grow-1" ref="messages-container" v-if="starterMessages.length > 0">
      <v-row v-for="message in starterMessages" :key="message.text" class="mb-2">
        <v-col>
          <v-chip
            variant="outlined"
            color="primary"
            class="float-left"
            label
            @click="startChat(message.text)"
          >
            {{ message.text }}
          </v-chip>
        </v-col>
      </v-row>
    </div>

    <div class="messages-container flex-grow-1" ref="messages-container" v-else>
      <v-row v-for="message in messages" :key="message.timestamp" class="mb-2">
        <v-col>
          <v-chip
            v-if="message.uuid === uuid"
            color="primary"
            text-color="white"
            class="float-right"
            label
          >
            {{ message.text }}
          </v-chip>

          <v-chip
            v-if="message.uuid !== uuid"
            variant="outlined"
            color="primary"
            class="float-left"
            label
          >
            {{ message.text }}
          </v-chip>
        </v-col>
      </v-row>
    </div>

    <div class="d-flex flex-column mt-12">
      <v-text-field
        v-model="currentMessage"
        label="New Message"
        @keyup.enter="sendMessage(currentMessage)"
      />
      <v-btn @click="sendMessage(currentMessage)" :disabled="!isConnected" color="primary">
        Send
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWebSocketStore } from '@/stores/websocket'

const store = useWebSocketStore()
const currentMessage = ref('')
const showError = ref(false)


const messagesContainer = useTemplateRef<HTMLDivElement>('messages-container')
// const messages = computed(() => store.messages)
const starterMessages = computed(() => store.starterMessages)
const isConnected = computed(() => store.isConnected)
const errorMessage = computed(() => store.errorMessage)
const uuid = computed(() => store.uuid)

const { messages }  = storeToRefs(store)

watch(errorMessage, () => {
  showError.value = !!errorMessage.value
})

watch(
  messages,
  async () => {
    if (messagesContainer.value) {
      await nextTick()
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  },
  { deep: true },
)

async function sendMessage(text: string) {
  const trimmed = text.trim()
  if (!trimmed || !isConnected.value) return

  store.sendMessage(trimmed)
  currentMessage.value = ''

  try {
    const coachReply = await getSmartReply(trimmed)

    if (coachReply) {
      console.log('Coach reply:', coachReply)
      store.addMessage(coachReply)
    }
  } catch (err) {
    console.error('Failed to fetch coach reply:', err)
  }
}


function startChat(text: string) {
  store.startChat(text.trim())
}

const getSmartReply = async (prompt: string) => {
  try {
    const res = await fetch('http://localhost:3000/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    console.log('coach response:', data.reponse);
    return data.response || ''
  } catch (err) {
    console.error('Error fetching smart reply:', err);
    return null;
  }
};

</script>

<style scoped>
.messages-container {
  overflow-x: hidden;
  overflow-y: scroll;
}

.float-right {
  float: right;
  clear: both;
}

.float-left {
  float: left;
  clear: both;
}
</style>
