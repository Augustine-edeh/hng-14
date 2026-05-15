import { ref } from "vue";
import type {
  Flight,
  OperationalAlert,
  DashboardMetrics,
  ActivityEvent,
} from "../types";
import {
  AIRPORTS,
  AIRCRAFT_TYPES,
  FLIGHT_STATUSES,
  ALERT_SEVERITIES,
  DEFAULT_METRICS,
} from "../constants";

/**
 * Event-driven streaming service for real-time aviation data
 * Simulates realistic flight data, alerts, and telemetry updates
 */
class StreamingService {
  private flights: Map<string, Flight> = new Map();
  private alerts: Map<string, OperationalAlert> = new Map();
  private metrics: DashboardMetrics = { ...DEFAULT_METRICS };
  private activityEvents: ActivityEvent[] = [];

  private streamInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(data: any) => void> = new Set();
  private isStreaming = false;
  private isPaused = false;

  // Generate realistic flight data
  private generateFlight(id: string): Flight {
    const originAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    let destAirport;
    do {
      destAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    } while (destAirport.code === originAirport.code);

    const now = new Date();
    const departureTime = new Date(now.getTime() - Math.random() * 3600000);
    const eta = new Date(now.getTime() + Math.random() * 7200000);

    return {
      id,
      flightNumber: `FL-${Math.floor(Math.random() * 9000) + 1000}`,
      aircraftType:
        AIRCRAFT_TYPES[Math.floor(Math.random() * AIRCRAFT_TYPES.length)],
      origin: originAirport.code,
      destination: destAirport.code,
      altitude: Math.floor(Math.random() * 43000) + 1000,
      speed: Math.floor(Math.random() * 400) + 300,
      fuel: Math.floor(Math.random() * 100),
      status: FLIGHT_STATUSES[
        Math.floor(Math.random() * FLIGHT_STATUSES.length)
      ] as any,
      delay: Math.floor(Math.random() * 120) - 30,
      weatherCondition: ["clear", "cloudy", "turbulent"][
        Math.floor(Math.random() * 3)
      ] as any,
      eta,
      departureTime,
      lastUpdate: now,
      latitude: (Math.random() - 0.5) * 180,
      longitude: (Math.random() - 0.5) * 360,
      route: this.generateRoute(),
    };
  }

  // Generate a flight route as array of lat/lon points
  private generateRoute(): [number, number][] {
    const points: [number, number][] = [];
    const startLat = (Math.random() - 0.5) * 180;
    const startLon = (Math.random() - 0.5) * 360;

    for (let i = 0; i < 10; i++) {
      points.push([
        startLat + (Math.random() - 0.5) * 10,
        startLon + (Math.random() - 0.5) * 10,
      ]);
    }
    return points;
  }

  // Generate alert with realistic aviation scenario
  private generateAlert(): OperationalAlert {
    const alertTypes = [
      "weather",
      "mechanical",
      "delay",
      "safety",
      "congestion",
    ];
    const type = alertTypes[
      Math.floor(Math.random() * alertTypes.length)
    ] as any;

    const messages: Record<string, string[]> = {
      weather: [
        "Severe turbulence detected near Abuja",
        "Thunderstorm forming near Lagos",
        "Wind shear warning at Heathrow",
        "Hail storm in approach corridor",
      ],
      mechanical: [
        "Hydraulic pressure anomaly detected",
        "Engine vibration warning",
        "Fuel system irregularity",
        "Landing gear diagnostic alert",
      ],
      delay: [
        "Gate delay at Lagos due to congestion",
        "Runway hold at Heathrow",
        "Taxiway congestion at Abuja",
        "Approach delay at JFK",
      ],
      safety: [
        "Bird strike hazard reported",
        "Unauthorized drone in airspace",
        "Security alert at terminal",
        "Runway incursion warning",
      ],
      congestion: [
        "Airport congestion increasing at Lagos",
        "High traffic volume at London",
        "Extended queuing time at Abuja",
        "Reduced runway capacity",
      ],
    };

    const message =
      messages[type][Math.floor(Math.random() * messages[type].length)];
    const severity = ALERT_SEVERITIES[
      Math.floor(Math.random() * ALERT_SEVERITIES.length)
    ] as any;

    return {
      id: `alert-${Date.now()}-${Math.random()}`,
      type: type as any,
      severity,
      message,
      timestamp: new Date(),
      resolved: false,
    };
  }

  // Generate activity event
  private generateActivityEvent(): ActivityEvent | null {
    const flights = Array.from(this.flights.values());
    if (flights.length === 0) return null;

    const flight = flights[Math.floor(Math.random() * flights.length)];
    const eventTypes = [
      `${flight.flightNumber} entered ${flight.destination} FIR`,
      `Weather update for flight ${flight.flightNumber}`,
      `Route optimization for ${flight.flightNumber}`,
      `Fuel efficiency optimized on ${flight.flightNumber}`,
      `Altitude adjustment for ${flight.flightNumber}`,
      `Speed adjustment for ${flight.flightNumber}`,
    ];

    return {
      id: `event-${Date.now()}-${Math.random()}`,
      type: "flight-update",
      title: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      description: `Live update for ${flight.flightNumber}`,
      timestamp: new Date(),
      relatedFlightId: flight.id,
    };
  }

  // Start streaming data
  public startStreaming(initialFlightCount: number = 20): void {
    if (this.isStreaming) return;
    this.isStreaming = true;
    this.isPaused = false;

    // Initialize flights
    for (let i = 0; i < initialFlightCount; i++) {
      const flight = this.generateFlight(`flight-${i}`);
      this.flights.set(flight.id, flight);
    }

    // Start update interval
    this.streamInterval = setInterval(() => this.streamUpdate(), 500);
  }

  // Update streaming data
  private streamUpdate(): void {
    if (this.isPaused) return;

    // Update existing flights
    for (const flight of this.flights.values()) {
      const variance = Math.random() * 100 - 50;
      flight.altitude = Math.max(
        0,
        Math.min(43000, flight.altitude + variance),
      );
      flight.speed = Math.max(
        200,
        Math.min(500, flight.speed + (Math.random() - 0.5) * 20),
      );
      flight.fuel = Math.max(
        0,
        Math.min(100, flight.fuel - Math.random() * 0.5),
      );
      flight.delay += Math.random() > 0.7 ? Math.random() * 5 - 2.5 : 0;
      flight.latitude += (Math.random() - 0.5) * 0.5;
      flight.longitude += (Math.random() - 0.5) * 0.5;
      flight.lastUpdate = new Date();

      // Emit flight update
      this.emit({
        type: "flight",
        data: flight,
        timestamp: new Date(),
      });
    }

    // Occasionally generate new alerts
    if (Math.random() > 0.85) {
      const alert = this.generateAlert();
      this.alerts.set(alert.id, alert);
      this.emit({
        type: "alert",
        data: alert,
        timestamp: new Date(),
      });
    }

    // Occasionally generate activity events
    if (Math.random() > 0.9) {
      const event = this.generateActivityEvent();
      if (event) {
        this.activityEvents.unshift(event);
        if (this.activityEvents.length > 100) {
          this.activityEvents.pop();
        }
      }
    }

    // Update metrics periodically
    if (Math.random() > 0.95) {
      this.updateMetrics();
      this.emit({
        type: "metric",
        data: this.metrics,
        timestamp: new Date(),
      });
    }

    // Occasionally add new flights
    if (Math.random() > 0.92 && this.flights.size < 50) {
      const flight = this.generateFlight(`flight-${Date.now()}`);
      this.flights.set(flight.id, flight);
    }

    // Occasionally remove old flights (landed/cancelled)
    if (Math.random() > 0.88) {
      const flights = Array.from(this.flights.values());
      if (flights.length > 5) {
        const randomFlight =
          flights[Math.floor(Math.random() * flights.length)];
        if (
          randomFlight.status === "landed" ||
          randomFlight.status === "cancelled"
        ) {
          this.flights.delete(randomFlight.id);
        }
      }
    }
  }

  // Update dashboard metrics
  private updateMetrics(): void {
    const flights = Array.from(this.flights.values());
    const delayedFlights = flights.filter((f) => f.delay > 0).length;
    const avgDelay =
      flights.reduce((sum, f) => sum + f.delay, 0) / flights.length || 0;

    this.metrics = {
      activeFlights: flights.length,
      delayedFlights,
      fleetHealthScore: Math.max(60, 100 - delayedFlights * 3),
      avgFuelEfficiency: Math.round(75 + Math.random() * 20),
      weatherRiskLevel: Math.random() > 0.7 ? "high" : "low",
      activeAlerts: this.alerts.size,
      aircraftInMaintenance: Math.floor(Math.random() * 5),
      avgArrivalDelay: Math.round(avgDelay),
    };
  }

  // Emit data to listeners
  private emit(data: any): void {
    this.listeners.forEach((listener) => listener(data));
  }

  // Subscribe to stream updates
  public subscribe(listener: (data: any) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Pause/resume streaming
  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  // Stop streaming
  public stopStreaming(): void {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
    this.isStreaming = false;
    this.flights.clear();
    this.alerts.clear();
    this.activityEvents = [];
  }

  // Get current state
  public getFlights(): Flight[] {
    return Array.from(this.flights.values());
  }

  public getAlerts(): OperationalAlert[] {
    return Array.from(this.alerts.values());
  }

  public getActivityEvents(): ActivityEvent[] {
    return this.activityEvents;
  }

  public getMetrics(): DashboardMetrics {
    return { ...this.metrics };
  }
}

// Export singleton instance
export const streamingService = new StreamingService();

// Composable for using streaming service
export function useStreaming() {
  const isStreaming = ref(false);
  const isPaused = ref(false);

  const startStreaming = (count?: number) => {
    streamingService.startStreaming(count);
    isStreaming.value = true;
  };

  const stopStreaming = () => {
    streamingService.stopStreaming();
    isStreaming.value = false;
  };

  const pauseStreaming = () => {
    streamingService.pause();
    isPaused.value = true;
  };

  const resumeStreaming = () => {
    streamingService.resume();
    isPaused.value = false;
  };

  const subscribe = (listener: (data: any) => void) => {
    return streamingService.subscribe(listener);
  };

  const getFlights = () => streamingService.getFlights();
  const getAlerts = () => streamingService.getAlerts();
  const getActivityEvents = () => streamingService.getActivityEvents();
  const getMetrics = () => streamingService.getMetrics();

  return {
    isStreaming,
    isPaused,
    startStreaming,
    stopStreaming,
    pauseStreaming,
    resumeStreaming,
    subscribe,
    getFlights,
    getAlerts,
    getActivityEvents,
    getMetrics,
  };
}
