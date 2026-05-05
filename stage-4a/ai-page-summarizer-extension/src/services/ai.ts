const BACKEND_API_URL = "http://localhost:5000/summarize";

export async function generateSummary(content: string) {
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary.");
  }

  const data = await response.json();

  return data.summary;
}
