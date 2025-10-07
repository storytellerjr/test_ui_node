// index.js - Pear v2 Entry Point (following official migration guide + worker API)
// https://docs.pears.com/pear-runtime/migration
// https://docs.pears.com/pear-runtime/api#pear.worker

import Runtime from 'pear-electron'
import Bridge from 'pear-bridge'

console.log('🌴 PearForm v2 starting with pear-electron...')

const bridge = new Bridge()
await bridge.ready()

console.log('🌉 Bridge ready, starting runtime...')

const runtime = new Runtime()
await runtime.ready()

console.log('🚀 Runtime ready, starting UI with worker piping...')

// Try the most basic runtime start
await runtime.start()

console.log('✅ PearForm v2 UI started!')

// Set up worker piping - this bridges the Pear.worker API with our bridge
global.setupWorkerPiping = () => {
  console.log('🔧 Setting up worker piping through bridge...')
  
  // Create worker pipe using Pear.worker API
  const workerPipe = global.Pear.worker.run('./worker.js', [])
  
  // Bridge worker responses back to frontend
  workerPipe.on('data', (response) => {
    console.log('Worker response via pipe:', response)
    bridge.emit('worker-response', response)
  })
  
  // Bridge frontend messages to worker
  bridge.on('worker-message', (message) => {
    console.log('Bridge forwarding message to worker:', message)
    workerPipe.write(message)
  })
  
  return workerPipe
}

console.log('�️  Desktop window should now be running')