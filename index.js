const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or gpt-4o if you have access
      messages: [
        {
          role: "system",
          content: `
You are a helpful AI nutrition assistant.
You can answer questions about diet, nutrition, food ingredients, recipes, and meal planning.
If the user wants to create a shopping list, help them by suggesting items and formatting a clear list.
If the user asks about calories or nutrients, give accurate information based on commonly available data.
Be friendly, concise, and clear. Use historical context from past conversations and information from the users profile.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const botResponse = completion.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
