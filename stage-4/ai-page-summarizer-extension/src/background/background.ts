import { generateSummary } from "../services/ai";

console.log("Background service worker loaded");

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "GENERATE_SUMMARY") {
    const run = async () => {
      try {
        const summary = await generateSummary(message.content);

        sendResponse({
          success: true,
          summary,
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    run();

    return true;
  }
});
