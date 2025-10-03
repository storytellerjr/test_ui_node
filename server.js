// server.js - Node.js server with Hypercore backend
// Run: node server.js

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Hypercore from 'hypercore';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ajv = new Ajv({ allErrors: true });

// Initialize Hypercore
const core = new Hypercore('./storage/schema_sheets_core', {
  valueEncoding: 'json'
});

await core.ready();
console.log('Hypercore initialized:', core.key.toString('hex').slice(0, 16) + '...');

// JSON Schema for validation
const schema = {
  "type": "object",
  "properties": {
    "keet_username": { "type": "string", "minLength": 1 },
    "github": { "type": "string" },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["keet_username", "description"]
};

const validate = ajv.compile(schema);

const server = createServer(async (req, res) => {
  const { method, url } = req;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Serve index.html
    if (url === '/' && method === 'GET') {
      const html = await readFile(join(__dirname, 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }

    // Submit form data
    if (url === '/api/submit' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          const formData = JSON.parse(body);
          
          // Validate against schema
          const valid = validate(formData);
          
          if (!valid) {
            console.log('❌ Validation failed:', validate.errors);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              errors: validate.errors 
            }));
            return;
          }

          console.log('✅ Validation successful');
          console.log('Form data:', formData);

          // Create record with metadata
          const record = {
            id: core.length,
            timestamp: new Date().toISOString(),
            data: formData
          };

          // Append to Hypercore
          await core.append(record);
          console.log('✅ Added to Hypercore at index:', record.id);
          console.log('Hypercore length:', core.length);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            record: record,
            totalRecords: core.length
          }));
        } catch (error) {
          console.error('❌ Error processing submission:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: error.message 
          }));
        }
      });
      return;
    }

    // Get all records
    if (url === '/api/records' && method === 'GET') {
      const records = [];
      for (let i = 0; i < core.length; i++) {
        const record = await core.get(i);
        records.push(record);
      }
      
      console.log(`📚 Retrieved ${records.length} records from Hypercore`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        records: records,
        totalRecords: core.length
      }));
      return;
    }

    // Get Hypercore info
    if (url === '/api/info' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        key: core.key.toString('hex'),
        length: core.length,
        byteLength: core.byteLength,
        writable: core.writable
      }));
      return;
    }

    // 404
    res.writeHead(404);
    res.end('Not Found');
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
🌴 Baby in a Box Test Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 URL: http://localhost:${PORT}
💾 Hypercore: schema_sheets_core
📊 Records: ${core.length}
🔑 Key: ${core.key.toString('hex').slice(0, 32)}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});