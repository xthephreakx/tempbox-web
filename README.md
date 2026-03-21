# TempBox Web

<p align="center">
  <img src="https://img.shields.io/badge/React-19-00FEA2?style=flat-square&logoColor=000" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-00A2FF?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Docker-ready-904CFE?style=flat-square" alt="Docker">
  <img src="https://img.shields.io/badge/mail.tm-API-FF007C?style=flat-square" alt="mail.tm">
  <img src="https://img.shields.io/badge/license-MIT-FFD300?style=flat-square&logoColor=000" alt="MIT License">
</p>

<p align="center">Self-hosted disposable email inbox — a web-based alternative to the unmaintained <a href="https://github.com/devwaseem/TempBox">TempBox macOS app</a>.</p>

---

## Background

[TempBox](https://github.com/devwaseem/TempBox) was a great little macOS app for managing disposable email addresses via the [mail.tm](https://mail.tm) API. It was clean, fast, and did exactly what it needed to do. Unfortunately it is no longer maintained and only works on macOS.

I wanted something that:
- Works on **any device** — phone, tablet, desktop, any OS
- Can be **self-hosted** without depending on a cloud service
- Runs in a **single Docker container** — no complex setup, no database
- Supports **multiple users** on the same instance — each with their own inboxes
- Is **open source** so others can use and build on it

So I built TempBox Web. Same idea, same API — just a web app you can run yourself.

---

## What is this?

TempBox Web lets you create and manage disposable email addresses using the free [mail.tm](https://mail.tm) API — no account, no sign-up required.

Run it on any machine that has Docker. Access it from your browser — on any device, on your local network, or over a VPN.

---

## Features

- **Multiple users** — Netflix-style profile selection on startup, each user has their own inboxes
- **Multiple inboxes per user** — create as many disposable addresses as you need
- **Auto-refresh** — inbox polls every 10 seconds (active account only)
- **HTML email rendering** — sandboxed iframe, no scripts executed
- **Persistent** — accounts survive restarts via a local JSON file (Docker volume)
- **8 color themes** — Cyberpunk (default), The Matrix (with l33t sp34k UI), Aliens (1986), and more
- **No external dependencies** — all mail API calls go directly from the browser to `api.mail.tm`
- **Single Docker container** — no database, no proxy required

---

## How it works

```
┌──────────────────────────────────────────────────────────┐
│                      Your Browser                        │
│                                                          │
│  ┌───────────────┐      ┌─────────────────────────────┐  │
│  │  React SPA    │◄────►│  mail.tm REST API           │  │
│  │  (UI/state)   │      │  api.mail.tm  (public)      │  │
│  └──────┬────────┘      └─────────────────────────────┘  │
│         │ /api/users (GET / PUT)                         │
└─────────┼────────────────────────────────────────────────┘
          │
┌─────────┼────────────────────────────────────────────────┐
│  Docker Container (:3000)                                │
│         │                                                │
│  ┌──────▼──────────────────────────────────────────────┐ │
│  │  Express server                                     │ │
│  │  · serves /dist  (React app)                        │ │
│  │  · GET /api/users  →  reads  data/users.json        │ │
│  │  · PUT /api/users  →  writes data/users.json        │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │  Docker Volume: tempbox_data                        │ │
│  │  /app/data/users.json                               │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Flow:**

1. You open the app → **user picker** appears ("Who's using TempBox?")
2. Select your profile (or create one — no password needed)
3. The app loads your disposable addresses from the server
4. Click **+** to create a new disposable address — TempBox calls `api.mail.tm` directly from your browser to register it
5. Your inbox auto-refreshes every 10 seconds
6. Click a message to read it — HTML is rendered in a sandboxed iframe
7. All addresses and tokens are stored in `data/users.json` on the server so they survive restarts

**No mail passes through TempBox** — it only stores the credentials. All email traffic goes through mail.tm's servers directly.

---

## Quick Start

### Docker Compose (recommended)

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/xthephreakx/tempbox-web/main/docker-compose.yml
docker compose up -d
```

Open `http://localhost:3000` in your browser. No build step needed — pulls the pre-built image from ghcr.io.

### Docker run

```bash
docker run -d \
  --name tempbox \
  -p 3000:3000 \
  -v tempbox_data:/app/data \
  --restart unless-stopped \
  ghcr.io/xthephreakx/tempbox-web:latest
```

### Build from source

```bash
git clone https://github.com/xthephreakx/tempbox-web.git
cd tempbox-web
docker compose up -d --build
```

### Custom port

```bash
PORT=8080 docker compose up -d
```

---

## Using it

1. **First launch** — you see a profile screen. Create a user (just a name, no password).
2. **Create an inbox** — click **+** in the sidebar. A disposable address is generated instantly.
3. **Give out the address** — use it wherever you need a temporary email.
4. **Read your mail** — messages appear in the inbox within seconds, auto-refreshed.
5. **Switch users** — click the **⇄** button next to your name in the sidebar.
6. **Delete an address** — open Account Info at the bottom of the sidebar and click Delete.

---

## Data

User accounts (email addresses + tokens) are stored in `/app/data/users.json` inside the container, mounted as a Docker volume. Your data persists across container restarts and updates.

```bash
# Back up your data
docker cp tempbox:/app/data/users.json ./users-backup.json

# Restore
docker cp ./users-backup.json tempbox:/app/data/users.json
```

---

## Updating

```bash
git pull
docker compose up -d --build
```

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Server | Express (serves static files + accounts API) |
| Fonts | Geist Mono · Syne · Orbitron (Google Fonts) |
| State | React Context + server-side JSON |
| API | [mail.tm REST API](https://docs.mail.tm) |
| Storage | Plain JSON file (no database) |

---

## Themes

| Theme | Notes |
|---|---|
| Cyberpunk | Default — neon teal + hot pink, Orbitron font |
| Dark Amber | Warm amber on dark |
| Gemstone Dusk | Deep purple |
| Sapphire Whisper | Cool blue |
| Aquamarine Citrine | Teal + orange |
| Tallgeese | Dark red |
| The Matrix | Green phosphor — all UI text converts to l33t sp34k |
| Aliens (1986) | Military olive + phosphor green |

---

## mail.tm API

This app uses the free [mail.tm](https://mail.tm) API. No API key required. No sign-up.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/domains` | List available domains |
| POST | `/accounts` | Register a new address |
| POST | `/token` | Get a JWT token |
| GET | `/messages` | List messages |
| GET | `/messages/{id}` | Read a full message |
| DELETE | `/messages/{id}` | Delete a message |
| DELETE | `/accounts/{id}` | Delete an address |

Rate limit: **30 requests / 60s per IP**. Only the active account is polled to stay within limits.

---

## Security Notes

- Email HTML is rendered in a sandboxed `<iframe sandbox="allow-same-origin">` — no scripts, no forms, no external navigation
- Passwords are stored in plaintext in the data volume — this is required by mail.tm since there is no token refresh endpoint
- Intended for personal/private use — do not expose to the public internet without adding authentication in front of it (e.g. via a reverse proxy with basic auth)

---

## Credits

Inspired by [TempBox for macOS](https://github.com/devwaseem/TempBox) by [@devwaseem](https://github.com/devwaseem).
Powered by the [mail.tm](https://mail.tm) API.

---

## License

[MIT](LICENSE) — feel free to self-host, fork, and modify.
