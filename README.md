# n8n-nodes-supergreen

This is an n8n community node for [Supergreen](https://supergreen.cc), the managed headless WhatsApp & Telegram automation infrastructure.

Automate conversations, send text & media, manage groups, and receive real-time webhook events across WhatsApp and Telegram directly in your n8n workflows — **without requiring Meta Cloud API verification or template approvals**.

---

## 🚀 Features

### WhatsApp Node (`Supergreen`)
- **Messages**: Send text messages with link previews and quote/reply support, edit messages, delete messages, and show typing indicators.
- **Media**: Send Images, Documents / PDFs, Videos, and Audio:
  - Direct from n8n Binary Data (files downloaded by previous nodes like HTTP Request, Google Drive, Email).
  - From public URLs (auto-downloaded and sent).
  - From Base64 encoded strings.
- **Polls**: Create and send interactive multi-choice polls.
- **Reactions**: React to any message with emojis (or clear reactions).
- **Group Management**:
  - List all groups the account belongs to.
  - Get group details and member lists.
  - Retrieve group invite links or join groups by invite code.
  - Add or remove participants (admin permission required).

### Telegram Node (`Supergreen`)
- Send text messages to any Telegram chat ID or `@username`.
- List joined Telegram groups and channels.
- Join public Telegram groups by username.

### Trigger Node (`Supergreen Trigger`)
- Webhook trigger that automatically registers with your Supergreen account when activated.
- Captures incoming messages, edits, reactions, poll votes, and lifecycle events (`connected`, `disconnected`, `banned`).
- Built-in filter to automatically ignore outgoing messages sent by the bot (`fromMe: true`).

---

## 📦 Installation

### In n8n UI (Community Nodes)
1. Go to **Settings** > **Community Nodes** in your n8n instance.
2. Select **Install a community node**.
3. Enter `n8n-nodes-supergreen` and agree to the risks.
4. Click **Install**.

### For Docker / Self-Hosted n8n
Inside your n8n installation directory or custom Dockerfile:

```bash
npm install n8n-nodes-supergreen
```

---

## 🔑 Credentials Setup

1. Sign in to your [Supergreen Dashboard](https://supergreen.cc).
2. Connect your WhatsApp number (via QR code or pairing code).
3. Copy your account's **Secret Token**.
4. In n8n, create a new credential under **Supergreen API**:
   - **Account Secret Token**: Paste your secret token.
   - **Default Phone Number**: (Optional) Enter your connected phone number (e.g. `14155552671` or `972501234567`, digits only). If set, you can leave the "Sender Phone Number" field blank in your workflow nodes.
   - **Base URL**: `https://api.supergreen.cc` (leave default unless using a dedicated instance).

---

## 💡 Example Workflows

### 1. Inbound WhatsApp AI Responder
```
[Supergreen Trigger] 
       ↓ (Incoming WhatsApp Message)
[AI Agent / LangChain Node] 
       ↓ (Generates Answer)
[Supergreen Node: Send Message]
```
- **Supergreen Trigger**: Set Network to `WhatsApp`, Events to `Message Received`, and check `Only Incoming Messages`.
- **Supergreen Node**: Action `Send Message`, set `toNumber` to `{{ $json.chat.id }}`, and `message` to the AI's generated response.

### 2. Send Invoices / PDFs via WhatsApp
```
[Webhook / CRM Trigger]
       ↓
[Generate PDF / Fetch Invoice Node]
       ↓ (Binary Data: 'data')
[Supergreen Node: Send Media]
```
- **Resource**: `Media`
- **Media Type**: `Document / PDF`
- **Media Source**: `Input Binary Field (Previous Node)` (`data`)
- **Recipient**: Customer's phone number

---

## 🛠️ Development & Building

```bash
# Clone the repository
git clone https://github.com/uriva/n8n-nodes-supergreen.git
cd n8n-nodes-supergreen

# Install dependencies
npm install

# Build TypeScript and copy assets
npm run build

# Link to local n8n for testing
npm link
cd ~/.n8n/custom
npm link n8n-nodes-supergreen
```

---

## 📄 License

[MIT](LICENSE)
