"use client";

export function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-700 px-4 text-white"
    >
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border-2 border-white text-4xl font-bold">
          H
        </div>
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
      </div>
    </div>
  );
}
