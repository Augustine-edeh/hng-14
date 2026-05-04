const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateSummary(content: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const trimmedContent = content.slice(0, 12000);

  const prompt = `
You are an AI page summarizer.

Summarize the following webpage content clearly and concisely.

Return:
- A short overview
- Key insights as bullet points
- Important takeaways

Keep the response readable and well formatted.

Webpage content:
${trimmedContent}
`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Gemini API Error:", errorText);

    if (response.status === 503) {
      throw new Error(
        "AI service is currently busy. Please try again in a few moments.",
      );
    }

    if (response.status === 429) {
      throw new Error("API quota exceeded. Please try again later.");
    }

    throw new Error("Failed to generate summary.");
  }

  const data = await response.json();

  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
