"use client";

import { requestInstallPanel } from "@/lib/pwa";

/**
 * A permanent, always-visible way into the install panel.
 *
 * The floating prompt depends on browser events and can be snoozed, so on its
 * own it will always feel like it "comes and goes". This link doesn't — it's
 * plain markup in the footer and opens the panel on demand.
 */
export default function InstallAppLink({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={requestInstallPanel}
      className={className || "text-left hover:text-brand-light"}
    >
      Install App
    </button>
  );
}
