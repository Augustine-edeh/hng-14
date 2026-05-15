# August Air Operations Command

A production-style real-time aviation operations dashboard built with Vue 3, TypeScript, Pinia, ECharts, Tailwind CSS, and shadcn-inspired UI primitives.

The app simulates a modern Airline Operations Control center for **August Air** with live fleet telemetry, performance charts, regional risk monitoring, validated activity events, controls for pausing/filtering the stream, and responsive dark/light theming.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Features

- Real-time mocked aviation stream with reconnect backoff and malformed payload rejection.
- Live line/area chart, bar chart, heatmap, metric cards, flight table, and activity feed.
- Pause/resume streaming, time range selection, region/severity filters, log search, chart mode switching, dataset toggles, and point inspection.
- Dark/light theme toggle with persisted preference.
- Mobile-first responsive layouts for phones, tablets, and wide operations-center screens.
- Schema validation with Zod and bounded in-memory buffers to prevent runaway growth.
- Clean component structure with reusable dashboard, chart, and shadcn-style UI components.

## Architecture

```text
src/
  components/
    charts/        Reusable ECharts visualizations
    dashboard/     Dashboard-specific controls, panels, tables, feed
    ui/            shadcn-inspired primitives
  lib/             Formatting, sanitization, and utility helpers
  models/          Typed aviation domain models and Zod schemas
  services/        Real-time stream simulator and resilience logic
  stores/          Pinia operations store
  views/           Top-level dashboard composition
```

## State Management Strategy

Pinia centralizes streaming state, filters, chart settings, selected inspection data, and connection health. Incoming data is handled through a single `ingest` path, which keeps the UI predictable and makes validation, buffering, and derived metrics easy to reason about.

The store exposes computed selectors for filtered chart points, visible flights, filtered activity events, regional summaries, and metric cards. This keeps components mostly presentational and avoids duplicating filtering logic across the app.

## Streaming Approach

`AviationStream` simulates a secure airline operations feed using timed batches. Each batch includes:

- Network operations point
- Current flight list
- Recent activity events

Every payload is validated with Zod before it reaches the store. The simulator occasionally emits malformed data and connection failures so the dashboard demonstrates resilience: bad payloads are rejected, errors are shown in the UI, and reconnect attempts use exponential backoff.

## Rendering Optimization Decisions

- Chart and event buffers are capped (`900` points, `220` events) to avoid unbounded memory growth.
- Chart datasets use ECharts canvas rendering and `sampling: "lttb"` for smoother large-series rendering.
- Computed selectors narrow the data sent to each component based on time range and filters.
- The activity feed renders the newest 80 retained events, keeping DOM size controlled while preserving a larger searchable buffer in state.
- Stream intervals and reconnect timers are cleaned up when the dashboard unmounts.
- Components receive only the data they need, and table/feed rows use stable identifiers.

## Security and Stability

- Zod validates all generated payloads at the boundary.
- External-style message text is sanitized before entering the event feed.
- No unsafe DOM injection is used.
- Stream timers and listeners are cleaned up to prevent leaks.
- Connection failure, reconnecting, paused, loading/empty, and degraded states are represented in UI.

## Trade-offs

ECharts adds bundle weight, but it provides mature canvas rendering, responsive resizing, smooth interaction, heatmaps, data zoom, and chart extensibility appropriate for a real-time analytics task. For a larger production app, charts could be route-level lazy loaded and split into separate chunks.

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
