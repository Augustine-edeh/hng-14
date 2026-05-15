import { z } from 'zod'

export const severityValues = ['normal', 'advisory', 'warning', 'critical'] as const
export const flightStatusValues = [
  'Boarding',
  'Taxi',
  'Climb',
  'Cruise',
  'Descent',
  'Approach',
  'Landed',
  'Delayed',
] as const

export type Severity = (typeof severityValues)[number]
export type FlightStatus = (typeof flightStatusValues)[number]
export type Region = 'West Africa' | 'Europe' | 'Middle East' | 'North America' | 'Southern Africa'
export type TimeRange = '1m' | '5m' | '15m' | '60m'
export type ChartMode = 'line' | 'area'
export type WeatherCondition = 'Clear' | 'Rain' | 'Turbulence' | 'Storm Cell' | 'Crosswind' | 'Low Visibility'
export type AirportCode = 'LOS' | 'ABV' | 'ACC' | 'LHR' | 'DXB' | 'KAN' | 'PHC' | 'JFK' | 'CPT'

export const OpsPointSchema = z.object({
  timestamp: z.number().int().positive(),
  region: z.string().min(2).max(32),
  airborne: z.number().int().nonnegative().max(240),
  onTimeRate: z.number().min(0).max(100),
  fuelEfficiency: z.number().min(0).max(100),
  safetyScore: z.number().min(0).max(100),
  maintenanceRisk: z.number().min(0).max(100),
  passengerLoad: z.number().min(0).max(100),
  delayMinutes: z.number().min(0).max(180),
  baggageThroughput: z.number().int().nonnegative().max(9000),
  networkLatency: z.number().min(0).max(2000),
})

export const FlightSchema = z.object({
  id: z.string().min(4).max(12),
  route: z.string().min(5).max(24),
  airline: z.string().min(3).max(32),
  origin: z.string().min(3).max(4),
  destination: z.string().min(3).max(4),
  aircraft: z.string().min(3).max(16),
  status: z.enum(flightStatusValues),
  region: z.string().min(2).max(32),
  altitude: z.number().int().min(0).max(45000),
  speed: z.number().int().min(0).max(620),
  heading: z.number().int().min(0).max(359),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fuelLevel: z.number().min(0).max(100),
  etaMinutes: z.number().int().min(-10).max(900),
  risk: z.number().min(0).max(100),
  delayStatus: z.enum(['On time', 'Minor delay', 'Major delay', 'Recovery']),
  weather: z.enum(['Clear', 'Rain', 'Turbulence', 'Storm Cell', 'Crosswind', 'Low Visibility']),
  maintenanceAlerts: z.array(z.string().min(2).max(70)).max(4),
  updatedAt: z.number().int().positive(),
})

export const AirportSchema = z.object({
  code: z.string().min(3).max(4),
  name: z.string().min(3).max(40),
  city: z.string().min(2).max(40),
  congestion: z.number().min(0).max(100),
  departures: z.number().int().nonnegative().max(200),
  arrivals: z.number().int().nonnegative().max(200),
  weather: z.enum(['Clear', 'Rain', 'Turbulence', 'Storm Cell', 'Crosswind', 'Low Visibility']),
  delayMinutes: z.number().min(0).max(180),
})

export const ActivityEventSchema = z.object({
  id: z.string().min(6).max(36),
  timestamp: z.number().int().positive(),
  severity: z.enum(severityValues),
  source: z.string().min(2).max(40),
  message: z.string().min(3).max(140),
  region: z.string().min(2).max(32),
  flightId: z.string().optional(),
})

export const StreamPayloadSchema = z.object({
  point: OpsPointSchema,
  flights: z.array(FlightSchema).max(80),
  airports: z.array(AirportSchema).max(20),
  events: z.array(ActivityEventSchema).max(12),
})

export type OpsPoint = z.infer<typeof OpsPointSchema>
export type Flight = z.infer<typeof FlightSchema>
export type Airport = z.infer<typeof AirportSchema>
export type ActivityEvent = z.infer<typeof ActivityEventSchema>
export type StreamPayload = z.infer<typeof StreamPayloadSchema>

export interface StreamHealth {
  status: 'connecting' | 'live' | 'paused' | 'degraded' | 'reconnecting' | 'offline'
  lastMessageAt: number | null
  reconnectAttempts: number
  error: string | null
}
