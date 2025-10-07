# 🌴 PearForms

**A customizable online peer-to-peer form, styled with your own custom stylesheet, logging your data locally instead of on Google Sheets.**

Own your data. Unstoppable. Built on [schema-sheets-cli](https://github.com/ryanramage/schema-sheets-cli) by [@ryanramage](https://github.com/ryanramage).

**✨ NEW: Now supports both Pear v1 and v2! Mobile-responsive design included.**

---

## 🎯 What is PearForms?

PearForms is a decentralized form solution that stores data in **Hypercore** instead of traditional cloud databases. Style it however you want, own your data completely.

**Features:**
- 🌐 **Dual-compatible:** Works with both Pear v1 (HTTP) and v2 (Worker messaging)
- ⚡ **Worker-powered:** Includes dedicated worker.js for Pear v2 backend processing
- 📱 **Responsive:** Mobile and desktop optimized
- 🎨 **Box Baby Theme:** Custom gold/black/green styling with palm trees
- 🔒 **P2P Storage:** Data stored locally in Hypercore
- ✅ **JSON Schema Validation:** Built-in form validation

## 📸 Screenshots

**Desktop Form View:**
![PearForm Desktop](show%20Pearform1.png)

**Mobile/Responsive View:**
![PearForm Mobile](show%20pearform2.png)

*The Box Baby theme features a dark gradient background with gold accents, palm tree decorations, and glassmorphism effects that work beautifully on both desktop and mobile devices.*

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm
- For Pear v2: `pear` CLI tool

### Installation

```bash
git clone https://github.com/storytellerjr/test_ui_node.git
cd test_ui_node
npm install
```

### Running the Application

**Pear v1 (HTTP Server):**
```bash
npm run start:v1
# or: npm start
```
Then open: http://localhost:3000

**Pear v2 (Desktop App with Worker Piping):**
```bash
npm run start:v2
# or: pear run -d .
```

Both versions use the same Hypercore storage and are fully compatible!

---

## 🔧 Pear v2 Worker Piping Implementation

### Architecture Comparison

**Pear v1 (HTTP):**
```
index.html ↔ fetch('/api/...') ↔ server.js ↔ Hypercore
```

**Pear v2 (Worker Messaging):**
```
index.html ↔ Pear.send() ↔ worker.js ↔ Hypercore
```

### Message Flow

1. **Frontend sends message:**
   ```javascript
   Pear.send({ action: 'submit', data: formData, id: 1 })
   ```

2. **Worker receives message:**
   ```javascript
   Pear.messages(async (message) => {
     const { action, data, id } = message
     // Process action, validate, save to Hypercore
   })
   ```

3. **Worker responds:**
   ```javascript
   Pear.message({ id: 1, success: true, record: {...} })
   ```

4. **Frontend receives response:**
   ```javascript
   Pear.messages((response) => {
     // Handle response based on ID
   })
   ```

### How to Verify Piping Works

**Console Output Differences:**
- **V1:** `🌐 FRONTEND: Using HTTP fetch`
- **V2:** `🌐 FRONTEND: Using Pear Worker` + worker message logs

**Network Tab:**
- **V1:** Shows HTTP requests to `/api/*` endpoints
- **V2:** **NO network requests** - all communication via worker messages

### Key Files for v2 Piping

- `index.js` - Pear v2 entry point that starts worker and view
- `worker.js` - **Dedicated backend worker** using `Pear.messages()`/`Pear.message()` for all Hypercore operations
- `index.html` - Auto-detects v2 and uses `Pear.send()`/`Pear.messages()` to communicate with worker

**The worker.js handles all backend logic including:**
- Hypercore database operations (append, read)
- JSON schema validation
- Message routing and response handling
- P2P data synchronization

---

### Run the Server

```bash
node server.js
```

Open your browser to: **http://localhost:3000**

---

## 📂 Project Structure

```
test_ui_node/
├── server.js           # Node.js server with Hypercore backend
├── index.html          # Custom themed form UI
├── storage/            # Hypercore data storage (auto-generated)
│   └── schema_sheets_core/
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the form UI |
| `/api/submit` | POST | Submit form data (validates & stores in Hypercore) |
| `/api/records` | GET | Retrieve all records from Hypercore |
| `/api/info` | GET | Get Hypercore metadata (key, length, etc.) |

---

## 🐍 Python Integration

You can query the Hypercore data using Python and Pandas:

```python
import pandas as pd
import requests

# Fetch all records
response = requests.get('http://localhost:3000/api/records')
data = response.json()

# Convert to DataFrame
df = pd.DataFrame([record['data'] for record in data['records']])
df
```

See the included Jupyter notebook for a complete example.

---

## 🎨 Custom Styling

The **Custom theme Box Baby simulates a Pear Baby sleeping in a box at night and** includes:
- Dark gradient background (black → green → black)
- Gold accents and borders
- Palm tree emoji decorations 🌴
- Glassmorphism effects
- Smooth transitions and hover states

All styling is in `index.html` (embedded CSS). Easily customizable for your brand.

---

## ✅ Validation

Form data is validated using **AJV (Another JSON Schema Validator)** against this schema:

```json
{
  "type": "object",
  "properties": {
    "keet_username": { "type": "string", "minLength": 1 },
    "github": { "type": "string" },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["keet_username", "description"]
}
```

---

## 🔮 Next Steps

Now that we've proven the stylesheets work in this test environment, the next phase is:

1. **Integrate these stylesheets into schema-sheets-cli**
2. **Update the PR** with findings from this test
3. **Work with Ryan** to merge the custom styling feature

---

## 🤝 Credits

- Built on [schema-sheets-cli](https://github.com/ryanramage/schema-sheets-cli) by [@ryanramage](https://github.com/ryanramage)
- Powered by [Hypercore](https://github.com/holepunchto/hypercore)
- Created by [@storytellerjr](https://github.com/storytellerjr)

---

## 📄 License

MIT

---

## 🌐 Links

- [schema-sheets-cli](https://github.com/ryanramage/schema-sheets-cli) - Original project
- [Pull Request](https://github.com/ryanramage/schema-sheets-cli/pull/2) - Our stylesheet contribution
- [Hypercore](https://github.com/holepunchto/hypercore) - P2P data storage

---

**Made with 🌴 by [@storytellerjr](https://github.com/storytellerjr)**