# AeroPulse Ops

AeroPulse Ops is a production-grade real-time aviation operations intelligence platform built with Vue 3, TypeScript, Vite, TailwindCSS, Pinia, VueUse, Apache ECharts, Lucide Vue icons, and shadcn-vue-inspired component primitives.

It is designed as a premium airline operations command center for monitoring active flights, telemetry, delays, aircraft health, airport congestion, weather disruption, operational alerts, and live aviation events.

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

## Product Experience

- Premium dark-first airline operations UI with persisted light/dark/system theme behavior.
- Real-time metric cards for active flights, delays, fleet health, weather risk, alerts, fuel efficiency, maintenance watch, and arrival performance.
- Smooth ECharts line/area, bar, and heatmap visualizations.
- Live flight operations table with search/filter context, sticky headers, status badges, and row drill-down.
- Real-time activity feed with severity indicators, relative timestamps, newest-first ordering, and event detail sheets.
- Lightweight aviation radar panel with animated aircraft markers, airport congestion indicators, and fullscreen expansion.
- Fullscreen analytics and sheet-style operational details for metrics, flights, charts, map, and events.

## Architecture

```text
src/
  components/
    charts/        Reusable Apache ECharts visualizations
    dashboard/     Product-specific dashboard modules and interaction panels
    ui/            shadcn-vue-inspired primitives
  lib/             Formatting, sanitization, and utility helpers
  models/          Typed aviation models and Zod schemas
  services/        Mock WebSocket-style aviation stream simulator
  stores/          Pinia state and selectors
  views/           Top-level application composition
```

Path aliases are configured through `@/*` for scalable imports.

## Streaming Architecture

The platform uses a mocked WebSocket-style stream service. It simulates batched aviation operations updates every 3.6 seconds instead of updating charts every second. This keeps the product realistic and stable, closer to an airline control center than a chaotic demo feed.

Each batch includes:

- Operational telemetry point
- Active flight set with position, route, fuel, weather, delay, and maintenance data
- Airport congestion and weather state
- Live activity events

Payloads are validated with Zod before entering application state. Malformed payloads are rejected, stream failures surface in the UI, and reconnect attempts use exponential backoff.

## State Management

Pinia centralizes stream health, points, flights, airports, events, filters, chart configuration, theme-driven interactions, selected flight/event/metric, and active detail panel state.

Computed selectors isolate rendering work:

- Filtered chart points
- Filtered flights
- Filtered events
- Regional summaries
- Real-time metrics

This keeps components mostly presentational and avoids duplicate filtering logic.

## Rendering and Performance

- Streaming updates are batched every 3.6 seconds.
- Chart and event buffers are capped to prevent memory growth.
- ECharts uses canvas rendering and `sampling: "lttb"` for smooth large-series rendering.
- Activity feed renders a limited visible slice while retaining a larger bounded buffer.
- Derived data is computed in the store to reduce component churn.
- Timers and reconnect handlers are cleaned up on unmount.
- Charts use responsive autoresize and stable dimensions to prevent layout shift.

## Responsiveness

The dashboard is mobile-first:

- Dense desktop grids collapse into readable stacked layouts.
- Tables use responsive overflow with sticky headers.
- Charts retain stable heights and touch-friendly interaction.
- Navigation adapts for small screens.
- Dialogs and sheets use viewport-aware sizing.

## UI/UX Rationale

The visual system is inspired by Linear, Vercel, Grafana, Bloomberg-style terminals, and modern enterprise aviation tooling. The interface uses dark mode as the primary experience, cyan aviation accents, subtle glass depth, concise typography, high information density, and clear interactive affordances.

Every major operational surface is clickable or expandable so the dashboard feels alive: metrics open analytics, rows open flight details, events open investigation sheets, charts open fullscreen analytics, and the radar expands into a broader traffic view.

## Security and Stability

- Zod validates all stream payloads.
- Event text is sanitized before display.
- No unsafe DOM injection.
- Empty, reconnecting, paused, degraded, and loading states are handled.
- Intervals and reconnect timers are cleaned up to prevent leaks.

## Trade-offs

Apache ECharts increases bundle size, but it provides mature real-time canvas charting, responsive resizing, tooltips, heatmaps, and extensibility. In a larger production SaaS app, chart panels would be lazy-loaded by route or panel expansion to split the bundle further.
