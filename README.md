# 🌴 PearForms

**A customizable online peer-to-peer form, styled with your own custom stylesheet, logging your data locally instead of on Google Sheets.**

Own your data. Unstoppable. Built on [schema-sheets-cli](https://github.com/ryanramage/schema-sheets-cli) by [@ryanramage](https://github.com/ryanramage).

---

## 🎯 What is PearForms?

PearForms is a decentralized form solution that stores data in **Hypercore** instead of traditional cloud databases. Style it however you want, own your data completely.

---

## 🛠️ Background & Purpose

### The Problem
We wanted to add **customized stylesheets** to Ryan's [schema-sheets-cli](https://github.com/ryanramage/schema-sheets-cli) app:

- ✅ We created custom stylesheets (Island Wealth theme)
- ✅ We submitted a [Pull Request](https://github.com/ryanramage/schema-sheets-cli/pull/2) to include these stylesheets
- ❌ **Issue discovered:** Our customized stylesheet was not being picked up by the schema-sheets-cli app

### The Solution: `test_ui_node`
To isolate and test the stylesheet functionality, we created **this test app** called `test_ui_node`.

**What it does:**
- Creates a Hypercore for local data storage
- Provides a simple HTML form to add records to PearForms
- Displays all records stored in the Hypercore
- Shows our custom Island Wealth stylesheet in action
- Allows querying the Hypercore via Python/Jupyter (Pandas integration)

**Conclusion:** ✅ **The stylesheets work perfectly.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/storytellerjr/test_ui_node.git
cd test_ui_node
npm install
```

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
├── index.html          # Island Wealth themed form UI
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

The **Island Wealth theme** includes:
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