# AeroPulse Ops - Aviation Operations Intelligence Platform

A production-grade real-time aviation operations intelligence platform featuring live data streaming, interactive charts, performance optimization, and enterprise-grade UI components.

## 🚀 Features

### Real-Time Data Streaming

- **Live Flight Tracking**: Real-time flight data updates with simulated aviation operations
- **Streaming Service**: Event-driven architecture for continuous data flow
- **Performance Optimized**: Efficient state management with minimal re-renders

### Interactive Dashboard

- **Live Charts**: Apache ECharts integration for altitude trends, performance metrics, and operational insights
- **Flight Table**: Sortable, filterable flight data with real-time updates
- **Activity Feed**: Real-time operational alerts and system notifications
- **Metric Cards**: Key performance indicators with animated counters

### Enterprise UI/UX

- **Glass Panel Design**: Modern aviation-themed interface with backdrop blur effects
- **Responsive Layout**: Optimized for desktop and large screen displays
- **Dark Theme**: Aviation-inspired color scheme with cyan accents
- **Smooth Animations**: CSS transitions and keyframe animations for professional feel

### Technical Excellence

- **TypeScript**: Full type safety across all components and services
- **Vue 3 Composition API**: Modern reactive programming patterns
- **Pinia State Management**: Centralized store for flight data, alerts, and UI state
- **TailwindCSS v4**: Custom aviation utilities with @layer organization

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3.5.34 with Composition API
- **Build Tool**: Vite 8.0.12
- **Type Checking**: TypeScript 5.7.2 with Vue TSC
- **State Management**: Pinia 3.0.4
- **Styling**: TailwindCSS v4 with custom aviation theme
- **Charts**: Apache ECharts 6.0.0 with Vue ECharts
- **Icons**: Heroicons Vue 2.2.0
- **Table Component**: TanStack Vue Table 8.21.3
- **Utilities**: VueUse Core 14.3.0

## 📁 Project Structure

```
src/
├── main.ts                    # Application entry point with Pinia setup
├── App.vue                    # Main dashboard layout
├── style.css                  # Global styles and TailwindCSS v4 utilities
├── shared/
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces for aviation data
│   ├── services/
│   │   └── streaming.ts      # Real-time data simulation service
│   └── components/            # Reusable UI components
│       ├── MetricCard.vue     # KPI display component
│       ├── Chart.vue          # ECharts wrapper component
│       ├── FlightTable.vue    # Data table with sorting/filtering
│       └── ActivityFeed.vue   # Real-time alerts feed
├── stores/                    # Pinia state management
│   ├── flightStore.ts         # Flight data management
│   ├── alertStore.ts          # Operational alerts
│   ├── metricsStore.ts        # Dashboard metrics
│   └── uiStore.ts             # UI state and controls
└── composables/               # Vue composables
    └── useStreamingData.ts    # Data streaming logic
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd stage-5a
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Components

### Streaming Service

The core of the real-time functionality is the `StreamingService` class that simulates aviation operations:

- Generates realistic flight data with ICAO callsigns
- Simulates flight phases (departure, en-route, arrival)
- Creates operational alerts and system notifications
- Uses event-driven updates for efficient state management

### State Management

Four Pinia stores manage different aspects of the application:

- **Flight Store**: Manages active flights with upsert operations
- **Alert Store**: Handles operational alerts and notifications
- **Metrics Store**: Calculates and updates dashboard KPIs
- **UI Store**: Controls streaming state and user preferences

### Custom Styling

TailwindCSS v4 custom utilities provide the aviation theme:

- `.glass-panel`: Backdrop blur panels for modern UI
- `.btn-primary`: Cyan-accented primary buttons
- `.metric-card`: KPI display cards with hover effects
- Aviation color scheme with dark backgrounds and cyan highlights

## 🔧 Configuration

### TailwindCSS v4 Setup

The project uses TailwindCSS v4 with custom utilities defined in `@layer utilities` in `src/style.css`. Component styles reference this file using `@reference "../../style.css"` for proper utility resolution.

### TypeScript Configuration

- Strict type checking enabled
- Vue 3 composition API types
- Custom aviation data interfaces

### Vite Configuration

- Vue plugin for SFC support
- TypeScript resolution
- Optimized build settings

## 📊 Data Simulation

The platform simulates realistic aviation operations:

- **Flight Data**: 50+ active flights with real airport codes
- **Performance Metrics**: Fuel efficiency, on-time performance, delay statistics
- **Operational Alerts**: Weather delays, maintenance issues, crew changes
- **Real-time Updates**: 2-5 second intervals for live data streaming

## 🎨 Design System

### Color Palette

- **Primary Dark**: `#0f172a` (Slate 900)
- **Secondary Dark**: `#0a0e27` (Custom dark)
- **Accent Cyan**: `#06b6d4` (Cyan 500)
- **Text Light**: `#e2e8f0` (Slate 200)

### Typography

- **Font Family**: System font stack for optimal performance
- **Sizes**: Responsive scaling from 0.875rem to 2rem
- **Weights**: 500 for buttons, 600 for headers

### Components

- **Glass Panels**: Semi-transparent backgrounds with blur effects
- **Metric Cards**: Hover animations and smooth transitions
- **Interactive Elements**: Focus states and accessibility support

## 🚀 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Efficient Updates**: Targeted re-renders with Vue 3 reactivity
- **Streaming Optimization**: Event-driven updates prevent unnecessary computations
- **Bundle Splitting**: Vite automatic code splitting

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality

- TypeScript strict mode
- Vue 3 Composition API best practices
- TailwindCSS utility-first approach
- Component-based architecture

## 📈 Future Enhancements

- **Map Integration**: Live flight tracking on interactive maps
- **Advanced Filtering**: Multi-criteria flight search and filtering
- **Historical Data**: Trend analysis and historical performance
- **User Authentication**: Role-based access control
- **API Integration**: Real aviation data sources
- **Mobile Responsive**: Touch-optimized mobile interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test thoroughly in development mode
5. Submit a pull request

## 📄 License

This project is part of the HNG Stage 5A internship program.

---

**Built with ❤️ for aviation operations excellence**
