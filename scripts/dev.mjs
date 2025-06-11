#!/usr/bin/env zx

import { spawn } from 'node:child_process'

$.verbose = true

console.log("🐳 Starting Docker...")
await $`npm run docker:up`

console.log("⏳ Waiting 3s for Docker to settle...")
await new Promise((r) => setTimeout(r, 3000))

console.log("🚀 Starting frontend and backend...")

const frontend = spawn('npm', ['run', 'dev:frontend'], { stdio: 'inherit', shell: true })
const backend = spawn('npm', ['run', 'dev:server'], { stdio: 'inherit', shell: true })

// Optional: open browser on Mac
await $`open http://localhost:8080`

// Stay alive as long as either process is running
await new Promise((resolve) => {
  frontend.on('exit', resolve)
  backend.on('exit', resolve)
})
