# AI Page Summarizer Chrome Extension

## Overview

AI Page Summarizer is a Chrome Extension built with Manifest V3 that extracts content from any webpage and generates a structured AI-powered summary.

It provides:

- concise summaries
- key insights
- estimated reading time
- fast cached responses

---

## Features

- Extracts readable content from webpages
- AI-powered summarization
- Markdown-formatted output
- Reading time estimation
- Copy-to-clipboard functionality
- Cached summaries per URL
- Graceful fallback for unsupported pages
- Clean and responsive popup UI

---

## Tech Stack

- React + Vite + TypeScript
- Chrome Extension Manifest V3
- Mozilla Readability (content extraction)
- OpenRouter API (AI summarization)
- Tailwind CSS (UI styling)

---

## Architecture

The extension follows a modular architecture:

Popup → Content Script → Background Worker → AI API

### Flow:

1. User clicks "Summarize Page"
2. Content script extracts readable content
3. Popup checks cache (chrome.storage)
4. If not cached:
   - Background worker sends content to AI API

5. Summary is returned and displayed
6. Result is cached for future use

---

## AI Integration

The extension uses OpenRouter to access LLM models.

- AI requests are handled in the background service worker
- Content is trimmed to reduce token usage
- Responses are structured using prompt engineering
- Markdown formatting is rendered in the UI

---

## Security Considerations

- API keys are not exposed in content scripts
- Environment variables are injected at build time
- Minimal Chrome permissions are used
- No user data is stored externally
- All caching is done locally via chrome.storage

---

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Add your API key in `.env`:

```env
VITE_OPENROUTER_API_KEY=your_api_key
```

4. Build the extension:

```bash
npm run build
```

5. Open Chrome and go to:

chrome://extensions

6. Enable Developer Mode
7. Click "Load Unpacked"
8. Select the `dist` folder

---

## Usage

1. Open any article or blog page
2. Click the extension icon
3. Click "Summarize Page"
4. View structured AI summary
5. Copy or reuse summary instantly

---

## Trade-offs

- Free-tier AI models may experience rate limits
- Large pages are truncated to optimize performance
- Some dynamic pages may not extract perfectly
- No backend proxy (local-only implementation)

---

## Future Improvements

- Model fallback system
- Highlight key points on page
- User-controlled summary length
- Dark/light theme toggle
- Backend proxy for secure API handling

---

## Demo

Include a short demo video (2–5 minutes) showing:

- installation
- summarization flow
- caching behavior
- UI interactions

---

## Author

Built by Augustine Edeh
