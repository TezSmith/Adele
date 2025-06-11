<template>
  <v-container fluid class="fill-height">
    <v-row align="start" justify="center" class="fill-height">
      <v-col>
        <h1 class="text-h4 mb-6">Chat Room</h1>
        <Chat />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Chat from '@/components/Chat.vue'
</script>
