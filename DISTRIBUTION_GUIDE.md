# Supergreen n8n Distribution & Launch Playbook

The GitHub repository is live at [https://github.com/uriva/n8n-nodes-supergreen](https://github.com/uriva/n8n-nodes-supergreen).

---

## Step 1: Publish to npm

npm requires an authenticated session. You can do this in either of two ways:

### Option A: Direct from terminal (fastest)
In your terminal, run:
```bash
cd /home/uri/uriva/n8n-nodes-supergreen
npm login
npm publish --access public
```

### Option B: Via GitHub Actions
1. Go to [https://github.com/uriva/n8n-nodes-supergreen/settings/secrets/actions](https://github.com/uriva/n8n-nodes-supergreen/settings/secrets/actions)
2. Add a repository secret named `NPM_TOKEN` with your npm access token.
3. Run the "Publish to npm" workflow in the Actions tab (or create a Release).

---

## Step 2: Post on n8n Community Forum

**Where:** [community.n8n.io](https://community.n8n.io) -> **Built with n8n & Node Exchange**

**Title:**
> Supergreen community node: headless WhatsApp and Telegram without Meta approvals

**Post Body:**
> Most people who want to automate WhatsApp in n8n run into the same wall. The official Meta WhatsApp Cloud API forces you through business verification, makes you submit message templates for review, and charges per outbound conversation.
>
> The alternative has usually been self-hosting Baileys or whatsapp-web.js in Docker, but that brings its own headaches: container session persistence, random disconnects, and IP bans if you don't manage proxies carefully.
>
> I built [Supergreen](https://supergreen.cc) to handle the infrastructure part (isolated Docker containers per account, session persistence, static proxy pinning to avoid bans). And I just published the n8n community node: `n8n-nodes-supergreen`.
>
> What it does:
> - **WhatsApp Messages**: Send plain text with link previews, quoted replies, edits, and typing indicators.
> - **Media**: Send documents, PDFs, images, video, and audio directly from preceding n8n nodes (binary data), public URLs, or base64.
> - **Groups**: List groups, pull member lists, create invite links, and join via code.
> - **Polls & Reactions**: Send interactive polls and emoji reactions.
> - **Trigger Node**: Inbound webhook that registers automatically with your Supergreen account when the workflow is activated. It receives incoming messages, reactions, edits, and connection status events, with a built-in toggle to filter out messages sent by the bot.
> - **Telegram**: Also supports sending messages and joining groups for connected Telegram accounts.
>
> Repository: https://github.com/uriva/n8n-nodes-supergreen
>
> Install via Settings -> Community Nodes -> `n8n-nodes-supergreen`.
>
> Let me know if there are specific endpoints or options you'd like added.

---

## Step 3: Reddit Post (r/n8n and r/selfhosted)

**Title:**
> Built an n8n node for WhatsApp automation without Meta Business verification

**Post Body:**
> If you've tried automating WhatsApp in n8n, you already know the pain of Meta's Business API. Getting numbers approved, waiting for template reviews, and paying per conversation for simple notifications makes no sense for most internal tools or alerts.
>
> I published a community node for Supergreen (`n8n-nodes-supergreen`). Supergreen runs headless WhatsApp Web sessions on dedicated VMs behind stable proxies, so your workflows can talk to normal WhatsApp numbers without the Meta verification hoop.
>
> The node covers:
> - Sending text, rich link previews, and quoted replies
> - Sending media directly from n8n binary data (PDF invoices, generated charts, images)
> - Real-time trigger node for incoming messages and reactions
> - Group management and Telegram support
>
> The repo is open source here: https://github.com/uriva/n8n-nodes-supergreen
>
> Feedback welcome on what actions or triggers would be most useful.

---

## Step 4: Submit to n8n Creator Hub / Integrations Directory

Go to [https://n8n.io/creators](https://n8n.io/creators) to list the node in n8n's public directory:
- **Package Name:** `n8n-nodes-supergreen`
- **GitHub URL:** `https://github.com/uriva/n8n-nodes-supergreen`
- **Category:** Communication / Messaging
