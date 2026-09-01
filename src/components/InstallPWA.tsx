"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, X, Share, Plus, MoreVertical } from "lucide-react";
import {
  APP_INSTALLED_EVENT,
  INSTALL_PROMPT_EVENT,
  SHOW_INSTALL_EVENT,
  getBridge,
  isDismissed,
  isIosLike,
  isStandalone,
  snoozeInstall,
  type InstallPromptEvent,
} from "@/lib/pwa";

/**
 * Install-app prompt.
 *
 * The event that powers this is captured before hydration (see lib/pwa.ts), so
 * a fast or cached load can no longer swallow it. If the browser gives us no
 * event at all we still show platform instructions, and the footer link can
 * open this panel on demand — so there is always a way to install.
 */
export default function InstallPWA() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"native" | "ios" | "generic">("generic");
  const [visible, setVisible] = useState(false);
  /** Opened deliberately from the footer — ignores the snooze. */
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const bridge = getBridge();
    const stashed = bridge?.evt ?? null;
    const ios = isIosLike();

    if (stashed) {
      setDeferred(stashed);
      setPlatform("native");
    } else if (ios) {
      setPlatform("ios");
    }

    // Auto-surface only when we can actually offer something useful, and only
    // after a beat so it never competes with the hero for the first paint.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if ((stashed || ios) && !isDismissed()) {
      timer = setTimeout(() => setVisible(true), 2500);
    }

    const onPrompt = () => {
      const evt = getBridge()?.evt ?? null;
      if (!evt) return;
      setDeferred(evt);
      setPlatform("native");
      if (!isDismissed()) setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setManual(false);
      setDeferred(null);
    };

    // Footer / anywhere else asking for the panel explicitly.
    const onShow = () => {
      setManual(true);
      setVisible(true);
    };

    window.addEventListener(INSTALL_PROMPT_EVENT, onPrompt);
    window.addEventListener(APP_INSTALLED_EVENT, onInstalled);
    window.addEventListener(SHOW_INSTALL_EVENT, onShow);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(INSTALL_PROMPT_EVENT, onPrompt);
      window.removeEventListener(APP_INSTALLED_EVENT, onInstalled);
      window.removeEventListener(SHOW_INSTALL_EVENT, onShow);
    };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // A deliberate open shouldn't start a 14-day snooze.
    if (!manual) snoozeInstall();
    setManual(false);
  }, [manual]);

  const install = useCallback(async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice?.outcome === "dismissed") snoozeInstall();
    } catch {
      /* prompt can only be used once — fall through */
    }
    setDeferred(null);
    setVisible(false);
    setManual(false);
  }, [deferred]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[310px] rounded-2xl border border-brand/25 bg-ink-card p-4 shadow-card">
      <button
        onClick={close}
        aria-label="Dismiss"
        className="absolute right-2 top-2 text-foreground/30 transition-colors hover:text-foreground/70"
      >
        <X size={15} />
      </button>

      <p className="pr-5 text-sm font-semibold">Install ViRaj Rides</p>

      {platform === "native" && deferred ? (
        <>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
            Get one-tap booking, offline access and a home-screen icon.
          </p>
          <button onClick={install} className="btn-brand mt-3 w-full !py-2 !text-xs">
            <Download size={14} /> Install App
          </button>
        </>
      ) : platform === "ios" ? (
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
          Tap <Share size={12} className="mx-0.5 inline text-brand" />
          <span className="font-medium text-foreground/75">Share</span>, then{" "}
          <Plus size={12} className="mx-0.5 inline text-brand" />
          <span className="font-medium text-foreground/75">Add to Home Screen</span>.
        </p>
      ) : (
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
          Open your browser menu{" "}
          <MoreVertical size={12} className="mx-0.5 inline text-brand" /> and choose{" "}
          <span className="font-medium text-foreground/75">Install app</span> or{" "}
          <span className="font-medium text-foreground/75">Add to Home screen</span>.
        </p>
      )}
    </div>
  );
}
