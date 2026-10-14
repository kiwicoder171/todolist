"use client";

import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.warn("PWA Service Worker registration skipped/failed:", error);
        });
    }
  }, []);

  return null;
}
