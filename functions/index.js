import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, context, messages } = req.body;

  const messageList = [];

  if (messages && Array.isArray(messages)) {
    messageList.push(...messages);
  } else if (message && typeof message === "string") {
    if (context && typeof context === "string") {
      messageList.push({ role: "system", content: context });
    }
    messageList.push({ role: "user", content: message });
  } else {
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${functions.config().openrouter.key}`,
        "HTTP-Referer": "https://mytrademind.com",
        "X-Title": "TradeMind Chat",
      },
      body: JSON.stringify({
        model: functions.config().openrouter.model || "openai/gpt-4",
        messages: messageList
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter error:", data);
      return res.status(500).json({ error: "OpenRouter API error", details: data });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ייצוא הפונקציה ל-Firebase
export const api = functions.https.onRequest(app);
