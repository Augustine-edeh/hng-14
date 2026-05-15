/**
 * Format timestamp to time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Format timestamp to date-time string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return formatDateTime(date);
}

/**
 * Format altitude (feet)
 */
export function formatAltitude(feet: number): string {
  return `${feet.toLocaleString()} ft`;
}

/**
 * Format speed (knots)
 */
export function formatSpeed(knots: number): string {
  return `${Math.round(knots)} kt`;
}

/**
 * Format fuel percentage
 */
export function formatFuel(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Format delay/time
 */
export function formatDelay(minutes: number): string {
  if (minutes < 0) return `${Math.abs(minutes)}m early`;
  if (minutes === 0) return "On time";
  return `+${minutes}m`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    "on-time": "bg-green-500/20 text-green-400 border-green-500/30",
    delayed: "bg-red-500/20 text-red-400 border-red-500/30",
    boarding: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    departed: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    landed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    operational: "bg-green-500/20 text-green-400 border-green-500/30",
    maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    grounded: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "in-transit": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return colorMap[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

/**
 * Get severity badge color
 */
export function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    colorMap[severity] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  );
}

/**
 * Get severity icon
 */
export function getSeverityIcon(severity: string): string {
  const iconMap: Record<string, string> = {
    critical: "⚠️",
    high: "⚡",
    medium: "⏱️",
    low: "ℹ️",
  };
  return iconMap[severity] || "ℹ️";
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random number in range
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get trend indicator
 */
export function getTrendIndicator(
  current: number,
  previous: number,
  inverse: boolean = false,
): string {
  const change = calculatePercentageChange(current, previous);
  const isPositive = inverse ? change < 0 : change > 0;
  if (change === 0) return "→";
  return isPositive ? "↑" : "↓";
}

/**
 * Get trend color
 */
export function getTrendColor(
  current: number,
  previous: number,
  inverse: boolean = false,
): string {
  const change = calculatePercentageChange(current, previous);
  const isPositive = inverse ? change < 0 : change > 0;
  if (change === 0) return "text-gray-400";
  return isPositive ? "text-green-400" : "text-red-400";
}
