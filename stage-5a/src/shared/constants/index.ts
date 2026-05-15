export const AIRPORTS = [
  { code: "LOS", name: "Lagos Murtala Muhammed" },
  { code: "ABV", name: "Abuja Nnamdi Azikiwe" },
  { code: "KAN", name: "Kano Mallam Aminu Kano" },
  { code: "PHC", name: "Port Harcourt Port Harcourt" },
  { code: "LHR", name: "London Heathrow" },
  { code: "CDG", name: "Paris Charles de Gaulle" },
  { code: "AMS", name: "Amsterdam Schiphol" },
  { code: "JFK", name: "New York JFK" },
];

export const AIRCRAFT_TYPES = [
  "Boeing 737",
  "Boeing 747",
  "Airbus A320",
  "Airbus A380",
  "Embraer E190",
  "Bombardier Q400",
  "Cessna 208",
];

export const FLIGHT_STATUSES = [
  "on-time",
  "delayed",
  "boarding",
  "departed",
  "landed",
  "cancelled",
] as const;
export const AIRCRAFT_STATUSES = [
  "operational",
  "maintenance",
  "grounded",
  "in-transit",
] as const;
export const WEATHER_CONDITIONS = [
  "clear",
  "cloudy",
  "stormy",
  "turbulent",
] as const;
export const ALERT_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#991b1b",
};

export const STATUS_COLORS: Record<string, string> = {
  "on-time": "#10b981",
  delayed: "#ef4444",
  boarding: "#3b82f6",
  departed: "#0ea5e9",
  landed: "#8b5cf6",
  cancelled: "#6b7280",
};

export const TIME_RANGES = [
  { value: "1m", label: "Last 1 minute" },
  { value: "5m", label: "Last 5 minutes" },
  { value: "15m", label: "Last 15 minutes" },
  { value: "1h", label: "Last 1 hour" },
  { value: "realtime", label: "Real-Time" },
] as const;

export const MAX_DATA_POINTS = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  realtime: 300,
};

export const UPDATE_INTERVAL = 500; // milliseconds
export const MAX_FLIGHTS = 50;
export const MAX_ACTIVITY_ITEMS = 100;

export const AIRCRAFT_TYPE_OPTIONS = AIRCRAFT_TYPES.map((type) => ({
  label: type,
  value: type,
}));

export const AIRPORT_OPTIONS = AIRPORTS.map((airport) => ({
  label: `${airport.code} - ${airport.name}`,
  value: airport.code,
}));

// Initial bounds for the aviation "map" (rough aviation boundaries)
export const AVIATION_BOUNDS = {
  minLat: -90,
  maxLat: 90,
  minLon: -180,
  maxLon: 180,
};

// Flight metrics defaults
export const DEFAULT_METRICS = {
  activeFlights: 0,
  delayedFlights: 0,
  fleetHealthScore: 95,
  avgFuelEfficiency: 87,
  weatherRiskLevel: "low" as const,
  activeAlerts: 0,
  aircraftInMaintenance: 0,
  avgArrivalDelay: 0,
};
