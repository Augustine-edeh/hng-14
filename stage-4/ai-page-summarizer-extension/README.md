# AI Page Summarizer Chrome Extension

A modern AI-powered Chrome Extension built with Manifest V3, React, Vite, and TypeScript that extracts webpage content and generates structured AI summaries.

## Overview

AI Page Summarizer is a Chrome Extension that:

- Extracts meaningful content from webpages
- Removes navigation/sidebar clutter using Mozilla Readability
- Generates structured AI summaries
- Displays concise insights and takeaways
- Estimates article reading time
- Caches summaries locally for performance optimization
- Provides a polished and responsive popup UI

The extension is built using Manifest V3 architecture and follows modular, production-minded engineering practices.

---

# Features

## Core Features

- AI-powered webpage summarization
- Readability-based content extraction
- Structured markdown summaries
- Background service worker architecture
- Popup-to-content-script messaging
- Local summary caching with `chrome.storage`
- Reading time estimation
- Copy summary to clipboard
- Reset/clear summary flow
- Loading states and skeleton loaders
- Error handling and fallback extraction logic

## UX Features

- Responsive popup UI
- Animated loading spinner
- Skeleton loading placeholders
- Cached summary indicators
- Markdown-rendered summaries
- Clean typography and spacing
- Keyboard-friendly interactions

## Performance Optimizations

- URL-based summary caching
- Content trimming before AI requests
- Prevention of duplicate AI requests
- Lightweight popup rendering

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Chrome Extension

- Manifest V3
- Chrome Runtime Messaging
- Background Service Worker
- Content Scripts
- Chrome Storage API

## AI Integration

- OpenRouter API
- OpenAI-compatible chat completions API

## Utilities

- Mozilla Readability
- React Markdown
- Lucide React Icons

---

# Project Structure

```txt
src/
│
├── background/
│   └── background.ts
│
├── content/
│   └── content.ts
│
├── popup/
│   ├── Popup.tsx
│   ├── main.tsx
│   └── styles.css
│
├── services/
│   └── ai.ts
│
├── storage/
│   └── summaryStorage.ts
│
├── types/
│   ├── ai.ts
│   ├── env.d.ts
│   └── messages.ts
│
├── utils/
│   └── readingTime.ts
│
└── manifest.ts
```

---

# Architecture

## High-Level Flow

```txt
Popup UI
   ↓
Content Script
   ↓
Extract Webpage Content
   ↓
Popup Receives Content
   ↓
Background Service Worker
   ↓
OpenRouter AI API
   ↓
AI Summary Returned
   ↓
Rendered in Popup UI
```

## Why Background Service Workers?

AI requests are handled inside the background service worker instead of the popup/content script to:

- Separate concerns cleanly
- Centralize API communication
- Improve maintainability
- Reduce UI complexity
- Align with proper extension architecture patterns

---

# Content Extraction Strategy

The extension uses Mozilla Readability to:

- Extract primary article content
- Remove ads and navigation clutter
- Improve AI summarization quality

Fallback extraction uses `document.body.innerText` for websites where Readability parsing fails.

---

# AI Integration

The extension uses OpenRouter's OpenAI-compatible API endpoint.

## Summary Generation Flow

1. Extract webpage content
2. Trim oversized content payloads
3. Send structured prompt to AI provider
4. Receive markdown-formatted summary
5. Render formatted markdown in popup

## AI Prompt Structure

The AI is instructed to generate:

- Short Overview
- Key Insights
- Important Takeaways

using markdown formatting for clean rendering.

---

# Caching Strategy

Summaries are cached using `chrome.storage.local`.

## Cache Key

Each summary is cached by webpage URL.

Example:

```json
{
  "https://example.com/article": "Generated AI summary"
}
```

## Benefits

- Faster repeat summaries
- Reduced API calls
- Lower token usage
- Improved UX responsiveness

---

# Security Decisions

## API Key Handling

- API keys are stored in `.env`
- Secrets are excluded from Git tracking
- AI requests are isolated to the background worker

## Permissions

The extension uses minimal required permissions:

- `activeTab`
- `storage`
- `scripting`

## Safe Rendering

- Summaries are rendered via markdown rendering
- No unsafe HTML injection is used
- No direct DOM injection from AI responses

---

# Trade-offs

## Using OpenRouter Instead of Direct Gemini Integration

OpenRouter was chosen for:

- Easier API access
- More reliable free-tier availability
- OpenAI-compatible architecture
- Faster development iteration

## Local Extension Only

This project is designed as a local installable Chrome Extension and is not intended for Chrome Web Store publishing.

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENROUTER_API_KEY=your_api_key_here
```

## 4. Build Extension

```bash
npm run build
```

## 5. Load Extension Into Chrome

1. Open:

```txt
chrome://extensions
```

2. Enable:

```txt
Developer mode
```

3. Click:

```txt
Load unpacked
```

4. Select the generated:

```txt
dist/
```

folder.

---

# Usage

1. Open any article or blog post
2. Click the extension icon
3. Click:

```txt
Summarize Page
```

4. Wait for AI summary generation
5. Copy, review, or reset the summary

---

# Demo Checklist

The demo video should showcase:

- Extension installation
- Popup UI
- Content extraction
- AI summary generation
- Loading states
- Cached summaries
- Copy summary feature
- Reset functionality
- Reading time estimation

---

# Future Improvements

Potential future enhancements include:

- Multi-language summaries
- Summary length selector
- Highlighting key points directly on webpages
- AI provider fallback system
- Export summaries to markdown/PDF
- Dark/light theme toggle
- Persistent user preferences

---

# License

MIT
