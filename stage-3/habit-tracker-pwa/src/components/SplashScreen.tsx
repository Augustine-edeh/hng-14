"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-4">✓</div>
        <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
      </div>
    </div>
  );
}
