import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/summarize", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the blog in 3-4 concise lines.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.5,
    });

    const summary = response.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.json({
      summary: "AI feature temporarily unavailable. (Quota exceeded)",
    });
  }
});

export default router;
