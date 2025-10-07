// worker.js - Pear v2 Backend Worker (using correct Pear.worker.pipe API)
// https://docs.pears.com/pear-runtime/api#pear.worker

import Hypercore from 'hypercore'
import Ajv from 'ajv'

console.log('🔧 PearForm v2 worker initializing...')

// Initialize Hypercore (same path as v1 for compatibility)
const core = new Hypercore('./storage/schema_sheets_core', {
  valueEncoding: 'json'
})

await core.ready()
console.log('✅ Worker: Hypercore initialized:', core.key.toString('hex').slice(0, 16) + '...')
console.log(`📊 Worker: Hypercore has ${core.length} existing records`)

// JSON Schema validation (same as v1)
const ajv = new Ajv({ allErrors: true })
const schema = {
  "type": "object",
  "properties": {
    "keet_username": { "type": "string", "minLength": 1 },
    "github": { "type": "string" },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["keet_username", "description"]
}
const validate = ajv.compile(schema)

// Use correct Pear.worker.pipe() API for communication
const pipe = Pear.worker.pipe()

// Listen for messages from the frontend via the pipe
pipe.on('data', async (msgData) => {
  const { action, data, id } = msgData

  console.log(`🔧 WORKER: Processing message - Action: ${action}, ID: ${id}`)

  await handleMessage(action, data, id)
})

async function handleMessage(action, data, id) {
  try {
    let response

    switch (action) {
      case 'submit':
        console.log(`📝 WORKER: Validating submission data...`)
        
        // Validate the form data
        const valid = validate(data)
        if (!valid) {
          response = { 
            id, 
            success: false, 
            errors: validate.errors 
          }
          console.log(`❌ WORKER: Validation failed for ID ${id}`)
          break
        }

        // Create record and append to Hypercore
        const record = {
          id: core.length,
          timestamp: new Date().toISOString(),
          data
        }
        
        await core.append(record)
        
        response = { 
          id, 
          success: true, 
          record, 
          totalRecords: core.length 
        }
        
        console.log(`✅ WORKER: Record ${record.id} saved, responding to ID ${id}`)
        break

      case 'getRecords':
        console.log(`📚 WORKER: Fetching all records...`)
        
        // Fetch all records from Hypercore
        const records = []
        for (let i = 0; i < core.length; i++) {
          records.push(await core.get(i))
        }
        
        response = { 
          id, 
          success: true, 
          records, 
          totalRecords: core.length 
        }
        
        console.log(`📊 WORKER: Sending ${records.length} records to ID ${id}`)
        break

      case 'getInfo':
        console.log(`ℹ️  WORKER: Sending Hypercore info...`)
        
        // Send Hypercore metadata
        response = {
          id,
          success: true,
          info: {
            key: core.key.toString('hex'),
            length: core.length,
            byteLength: core.byteLength,
            writable: core.writable
          }
        }
        
        console.log(`ℹ️  WORKER: Hypercore info sent to ID ${id}`)
        break

      default:
        response = { 
          id, 
          success: false, 
          error: `Unknown action: ${action}` 
        }
        console.log(`❌ WORKER: Unknown action ${action} for ID ${id}`)
    }

    // Send response back to frontend via the pipe
    pipe.write(response)

  } catch (error) {
    console.error(`❌ WORKER: Error processing ${action} for ID ${id}:`, error)
    pipe.write({ 
      id, 
      success: false, 
      error: error.message 
    })
  }
}

console.log('🎯 Worker ready to process messages via Pear.worker.pipe()!')