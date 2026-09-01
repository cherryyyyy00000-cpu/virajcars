/**
 * PWA install plumbing.
 *
 * The install button used to appear only sometimes. Two races caused it:
 *
 *  1. Chrome fires `beforeinstallprompt` shortly after load — frequently BEFORE
 *     React hydrates. A listener attached inside useEffect therefore misses the
 *     event on fast/cached loads, and the button never appears. The fix is to
 *     capture the event in a tiny synchronous script at the top of <body> and
 *     stash it on `window`, so React can pick it up whenever it hydrates.
 *
 *  2. The service worker was registered from a `load` listener attached inside
 *     useEffect. If hydration happened after `load` had already fired, the
 *     callback never ran, the SW never registered, and Chrome's installability
 *     criteria were never met — so no event fired at all.
 */

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallBridge = {
  evt: InstallPromptEvent | null;
  installed: boolean;
};

declare global {
  interface Window {
    __vrInstall?: InstallBridge;
  }
}

export const INSTALL_PROMPT_EVENT = "vr:installprompt";
export const APP_INSTALLED_EVENT = "vr:appinstalled";
export const SHOW_INSTALL_EVENT = "vr:show-install";

/**
 * Runs synchronously at the top of <body>, long before hydration, so the
 * install event can never be missed.
 */
export const INSTALL_BRIDGE_SCRIPT = `
(function () {
  var w = window;
  w.__vrInstall = w.__vrInstall || { evt: null, installed: false };
  w.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    w.__vrInstall.evt = e;
    w.dispatchEvent(new Event('${INSTALL_PROMPT_EVENT}'));
  });
  w.addEventListener('appinstalled', function () {
    w.__vrInstall.evt = null;
    w.__vrInstall.installed = true;
    w.dispatchEvent(new Event('${APP_INSTALLED_EVENT}'));
  });
})();
`.trim();

export function getBridge(): InstallBridge | null {
  if (typeof window === "undefined") return null;
  return window.__vrInstall ?? null;
}

/** Already running as an installed app? */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * iOS/iPadOS Safari, which has no `beforeinstallprompt` at all.
 * iPadOS 13+ reports itself as "Macintosh", hence the touch-point check —
 * without it, iPads got no install option whatsoever.
 */
export function isIosLike(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)) return true;
  return /Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1;
}

// ---- Dismissal, with an expiry so the option can never vanish forever ----

const DISMISS_KEY = "vr_install_dismissed_at";
const DISMISS_DAYS = 14;

export function isDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) {
      // Migrate the old permanent flag into a 14-day snooze.
      if (localStorage.getItem("vr_install_dismissed") === "1") {
        localStorage.removeItem("vr_install_dismissed");
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        return true;
      }
      return false;
    }
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    const expired = Date.now() - at > DISMISS_DAYS * 24 * 60 * 60 * 1000;
    if (expired) {
      localStorage.removeItem(DISMISS_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function snoozeInstall(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode — fine, it just won't persist */
  }
}

/** Opens the install panel from anywhere (e.g. the footer link). */
export function requestInstallPanel(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHOW_INSTALL_EVENT));
}
