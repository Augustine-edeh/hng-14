const BACKEND_API_URL = "https://hng-14-task-4a.onrender.com/summarize";

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
