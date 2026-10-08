import "dotenv/config";
import express from "express";
import pino from "pino";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    name: "ZYREX AI",
    version: "V1",
    status: "online"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ZYREX AI server running on port ${PORT}`);
});

const logger = pino({ level: "silent" });

async function startZyrex() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  // WhatsApp Pairing Code
  if (!state.creds.registered) {
    const phoneNumber = process.env.PAIRING_NUMBER;

    if (!phoneNumber) {
      console.log(
        "⚠️ PAIRING_NUMBER is not configured."
      );
    } else {
      setTimeout(async () => {
        try {
          const code =
            await sock.requestPairingCode(phoneNumber);

          console.log("================================");
          console.log("🔐 ZYREX AI PAIRING CODE");
          console.log(code);
          console.log("================================");
        } catch (error) {
          console.error(
            "❌ Pairing code error:",
            error.message
          );
        }
      }, 3000);
    }
  }

  sock.ev.on(
    "connection.update",
    ({ connection, lastDisconnect }) => {
      if (connection === "connecting") {
        console.log("🔌 Connecting ZYREX AI...");
      }

      if (connection === "open") {
        console.log(
          "✅ ZYREX AI connected to WhatsApp!"
        );
      }

      if (connection === "close") {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;

        console.log("❌ WhatsApp connection closed.");

        if (shouldReconnect) {
          console.log("🔄 Reconnecting...");
          startZyrex();
        }
      }
    }
  );

  sock.ev.on(
    "messages.upsert",
    async ({ messages }) => {
      const message = messages[0];

      if (!message?.message) return;
      if (message.key.fromMe) return;

      const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        "";

      console.log("📩 Message:", text);

      if (text.toLowerCase().trim() === "zyrex") {
        await sock.sendMessage(
          message.key.remoteJid,
          {
            text: "🤖 ZYREX AI is online!"
          }
        );
      }
    }
  );
}

startZyrex().catch((error) => {
  console.error(
    "🔥 ZYREX AI Error:",
    error
  );
});
