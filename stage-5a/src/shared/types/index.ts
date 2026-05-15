// Flight status types
export type FlightStatus =
  | "on-time"
  | "delayed"
  | "boarding"
  | "departed"
  | "landed"
  | "cancelled";
export type AircraftStatus =
  | "operational"
  | "maintenance"
  | "grounded"
  | "in-transit";
export type WeatherCondition = "clear" | "cloudy" | "stormy" | "turbulent";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

// Core Flight Data
export interface Flight {
  id: string;
  flightNumber: string;
  aircraftType: string;
  origin: string;
  destination: string;
  altitude: number; // feet
  speed: number; // knots
  fuel: number; // percentage 0-100
  status: FlightStatus;
  delay: number; // minutes
  weatherCondition: WeatherCondition;
  eta: Date;
  departureTime: Date;
  lastUpdate: Date;
  latitude: number;
  longitude: number;
  route: [number, number][]; // array of [lat, lon] pairs
}

// Aircraft Telemetry
export interface AircraftTelemetry {
  aircraftId: string;
  aircraftType: string;
  altitude: number;
  airspeed: number;
  fuelBurn: number;
  engineTemp: number;
  hydraulicPressure: number;
  timestamp: Date;
}

// Airport Status
export interface AirportStatus {
  code: string;
  name: string;
  congestion: number; // 0-100
  delayCount: number;
  activeFlights: number;
  avgDelay: number;
}

// Operational Alert
export interface OperationalAlert {
  id: string;
  type: "weather" | "mechanical" | "delay" | "safety" | "congestion";
  severity: AlertSeverity;
  message: string;
  relatedFlight?: string;
  relatedAirport?: string;
  timestamp: Date;
  resolved: boolean;
}

// Activity Event
export interface ActivityEvent {
  id: string;
  type: "flight-update" | "alert" | "weather" | "maintenance";
  title: string;
  description: string;
  severity?: AlertSeverity;
  timestamp: Date;
  relatedFlightId?: string;
  relatedAirportCode?: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  activeFlights: number;
  delayedFlights: number;
  fleetHealthScore: number; // 0-100
  avgFuelEfficiency: number; // percentage
  weatherRiskLevel: AlertSeverity;
  activeAlerts: number;
  aircraftInMaintenance: number;
  avgArrivalDelay: number; // minutes
}

// Real-time Stream Data
export interface StreamMessage {
  type: "flight" | "alert" | "metric" | "telemetry";
  data: Flight | OperationalAlert | DashboardMetrics | AircraftTelemetry;
  timestamp: Date;
}

// Chart Data Point
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

// Time Range Type
export type TimeRange = "1m" | "5m" | "15m" | "1h" | "realtime";

// Filter Options
export interface FilterOptions {
  airports: string[];
  aircraft: string[];
  statuses: FlightStatus[];
  alertSeverities: AlertSeverity[];
}
