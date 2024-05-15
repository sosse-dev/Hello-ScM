"use client";

import { useEffect, useState } from "react";

export function UseCheckConnection() {
  if (typeof navigator !== "undefined" && navigator) {
    const [isOnline, setIsOnline] = useState(navigator?.onLine ?? false);
    useEffect(() => {
      const handleStatusOnline = () => {
        setIsOnline(navigator?.onLine);
      };

      window.addEventListener("online", handleStatusOnline);
      window.addEventListener("offline", handleStatusOnline);
      return () => {
        window.removeEventListener("online", handleStatusOnline);
        window.removeEventListener("offline", handleStatusOnline);
      };
    }, [isOnline]);

    return [isOnline];
  } else {
    const isOnline = false;
    return [isOnline];
  }
}
