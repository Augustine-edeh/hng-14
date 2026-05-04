const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateSummary(content: string) {
  const apiKey = __OPENROUTER_API_KEY__;

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
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      // model: "meta-llama/llama-3.1-8b-instruct:free",
      // model: "google/gemma-3-27b-it:free",
      // model: "mistralai/mistral-7b-instruct:free",
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

    console.error("OpenRouter API Error:", errorText);

    if (response.status === 429) {
      throw new Error("AI quota exceeded. Please try again later.");
    }

    if (response.status === 503) {
      throw new Error("AI service is temporarily busy. Please retry shortly.");
    }

    throw new Error("Failed to generate summary.");
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content;
}
