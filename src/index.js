import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ZYREX AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #050505;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .box {
      width: 100%;
      max-width: 650px;
      background: #101010;
      padding: 25px;
      border-radius: 20px;
      border: 1px solid #292929;
      box-shadow: 0 0 40px rgba(255,255,255,0.05);
    }

    h1 {
      text-align: center;
      font-size: 42px;
      margin: 0 0 8px;
    }

    .status {
      text-align: center;
      color: #777;
      margin-bottom: 25px;
    }

    textarea {
      width: 100%;
      height: 130px;
      padding: 15px;
      border-radius: 14px;
      background: #181818;
      color: white;
      border: 1px solid #333;
      outline: none;
      resize: none;
      font-size: 16px;
    }

    textarea:focus {
      border-color: #666;
    }

    button {
      width: 100%;
      margin-top: 12px;
      padding: 15px;
      border: none;
      border-radius: 14px;
      background: white;
      color: black;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    #answer {
      margin-top: 20px;
      padding: 18px;
      background: #181818;
      border: 1px solid #292929;
      border-radius: 14px;
      white-space: pre-wrap;
      line-height: 1.5;
      min-height: 60px;
    }
  </style>
</head>

<body>

  <div class="box">

    <h1>ZYREX AI</h1>

    <div class="status">
      AI Assistant • Online
    </div>

    <textarea
      id="message"
      placeholder="Ask Zyrex AI anything..."
    ></textarea>

    <button id="sendBtn" onclick="askAI()">
      SEND
    </button>

    <div id="answer">
      Zyrex AI is ready.
    </div>

  </div>

<script>

async function askAI() {

  const message =
    document.getElementById("message").value.trim();

  const answer =
    document.getElementById("answer");

  const button =
    document.getElementById("sendBtn");

  if (!message) {
    answer.textContent = "Please enter a message.";
    return;
  }

  button.disabled = true;
  answer.textContent = "Zyrex is thinking...";

  try {

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      answer.textContent =
        "Error: " + (data.error || "Something went wrong.");
    } else {
      answer.textContent =
        data.reply || "No response received.";
    }

  } catch (error) {

    answer.textContent =
      "Connection error. Please try again.";

  } finally {

    button.disabled = false;

  }
}

</script>

</body>
</html>
  `);
});

app.post("/api/chat", async (req, res) => {

  try {

    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(message);

    const response = await result.response;

    const text = response.text();

    return res.json({
      reply: text
    });

  } catch (error) {

    console.error("Gemini Error:", error);

    return res.status(500).json({
      error: "Gemini API request failed."
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ZYREX AI running on port ${PORT}`);
});
