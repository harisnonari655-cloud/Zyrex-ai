const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ZYREX AI</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #080808;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .box {
          width: 90%;
          max-width: 600px;
        }
        h1 {
          text-align: center;
          font-size: 40px;
        }
        textarea {
          width: 100%;
          height: 120px;
          box-sizing: border-box;
          padding: 15px;
          border-radius: 12px;
          background: #151515;
          color: white;
          border: 1px solid #333;
          resize: none;
        }
        button {
          width: 100%;
          margin-top: 12px;
          padding: 15px;
          border: 0;
          border-radius: 12px;
          background: #ffffff;
          color: #000;
          font-weight: bold;
          cursor: pointer;
        }
        #answer {
          margin-top: 20px;
          padding: 15px;
          background: #151515;
          border-radius: 12px;
          white-space: pre-wrap;
          min-height: 50px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>ZYREX AI</h1>

        <textarea id="message" placeholder="Ask Zyrex AI anything..."></textarea>

        <button onclick="askAI()">SEND</button>

        <div id="answer">Zyrex AI is ready.</div>
      </div>

      <script>
        async function askAI() {
          const message = document.getElementById("message").value;
          const answer = document.getElementById("answer");

          if (!message.trim()) {
            answer.textContent = "Please enter a message.";
            return;
          }

          answer.textContent = "Zyrex is thinking...";

          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (data.error) {
              answer.textContent = "Error: " + data.error;
            } else {
              answer.textContent = data.reply;
            }
          } catch (error) {
            answer.textContent = "Connection error.";
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Gemini API request failed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ZYREX AI running on port ${PORT}`);
});
