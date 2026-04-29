"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/SplashScreen";
import { getAuthSession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getAuthSession();
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {showSplash && <SplashScreen />}
      <div className="w-full h-screen bg-blue-600" />
    </>
  );
}
