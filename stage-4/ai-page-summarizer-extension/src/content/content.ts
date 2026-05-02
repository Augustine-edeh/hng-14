import { Readability } from "@mozilla/readability";
import type { ExtractContentResponse } from "../types/messages";

console.log("Content script loaded");

chrome.runtime.onMessage.addListener(
  (
    message: { type: string },
    _: chrome.runtime.MessageSender,
    sendResponse: (response: ExtractContentResponse) => void,
  ) => {
    if (message.type === "EXTRACT_PAGE_CONTENT") {
      try {
        const clonedDocument = document.cloneNode(true) as Document;

        const article = new Readability(clonedDocument).parse();

        if (!article) {
          sendResponse({
            success: false,
            error: "Could not extract readable content",
          });

          return;
        }

        sendResponse({
          success: true,
          data: {
            title: article.title ?? "Untitled Page",
            content: article.textContent ?? "",
            url: window.location.href,
          },
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: "Failed to extract page content",
        });
      }

      return true;
    }
  },
);
