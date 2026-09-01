"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice?: Promise<unknown> };

/**
 * Install-app prompt.
 *
 * Chrome/Edge/Android fire `beforeinstallprompt`, so we show a real install
 * button. iOS Safari has no such event, so we show short "Add to Home Screen"
 * instructions instead — that way the option is always visible.
 */
export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed?
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    if (localStorage.getItem("vr_install_dismissed") === "1") return;
    setDismissed(false);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS fallback — no beforeinstallprompt support
    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    if (isIos) {
      setShowIosHelp(true);
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function close() {
    setVisible(false);
    localStorage.setItem("vr_install_dismissed", "1");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    setVisible(false);
  }

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[300px] rounded-2xl border border-brand/25 bg-ink-card/95 p-4 shadow-card">
      <button
        onClick={close}
        aria-label="Dismiss"
        className="absolute right-2 top-2 text-foreground/30 hover:text-foreground/70"
      >
        <X size={15} />
      </button>

      <p className="pr-5 text-sm font-semibold">Install ViRaj Rides</p>

      {showIosHelp ? (
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
          Tap <Share size={12} className="mx-0.5 inline text-brand" /> Share, then
          &ldquo;Add to Home Screen&rdquo; to use it like an app.
        </p>
      ) : (
        <>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
            Get one-tap booking, offline access and a home-screen icon.
          </p>
          <button onClick={install} className="btn-brand mt-3 w-full !py-2 !text-xs">
            <Download size={14} /> Install App
          </button>
        </>
      )}
    </div>
  );
}
