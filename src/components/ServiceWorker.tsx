"use client";

import { useEffect } from "react";

/**
 * Registers the service worker.
 *
 * The previous version attached a `load` listener from inside useEffect. When
 * hydration finished after `load` had already fired — which is the common case
 * on this page — the callback never ran, the worker never registered, and
 * Chrome's installability criteria were never met. That is why the install
 * button appeared only sometimes. Now we register immediately if the document
 * is already loaded, and only wait for `load` when it genuinely hasn't fired.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
