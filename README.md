# ZYREX AI — V1

Starter project for a personal WhatsApp AI assistant.

## V1 features
- WhatsApp multi-device connection
- Pairing-code bootstrap
- Persistent auth-state structure
- Basic commands
- Health endpoint
- Environment variables
- Automatic reconnect unless logged out

## Planned
1. AI brain + memory
2. Speech-to-text
3. High-quality text-to-speech
4. Authorized voice cloning
5. Image/screenshot understanding
6. Scheduler/reminders
7. Tool calling and web actions
8. Android companion app
9. Web dashboard
10. Offline task queue

## Local setup

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm start
```

Put your own WhatsApp number in `PAIRING_NUMBER` using country code digits only.

Never upload `.env` or `auth_info/` to GitHub.

## Cloud

This repository is designed to be connected to a Node-compatible cloud service. For production WhatsApp sessions, use persistent storage and keep secrets in environment variables.

## Safety

Use automation responsibly. Do not use the bot for spam, bulk unsolicited messages, stalking, abuse, or other prohibited activity.
