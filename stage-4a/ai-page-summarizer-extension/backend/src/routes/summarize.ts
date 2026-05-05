import { Router } from "express";

const router = Router();

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content is required",
      });
    }

    const trimmedContent = content.slice(0, 12000);

    const prompt = `
You are an AI webpage summarizer.

Summarize the webpage clearly and concisely.

Return your response in markdown format.

Include:

### Short Overview

A concise paragraph summary.

### Key Insights

Bullet points of important ideas.

### Important Takeaways

Bullet points of actionable or memorable conclusions.

Webpage content:
${trimmedContent}
`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter Error:", errorText);

      return res.status(500).json({
        error: "Failed to generate summary",
      });
    }

    const data = await response.json();

    const summary = data.choices?.[0]?.message?.content;

    return res.json({
      summary,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
