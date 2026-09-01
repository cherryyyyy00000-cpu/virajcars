import { SITE } from "@/lib/site";

/**
 * The ViRaj Rides "VR" monogram, recreated from the company signboard —
 * a single continuous stroke forming a V flowing into an R, in the
 * brand's copper-bronze finish.
 */
export function VRMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="vr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8A860" />
          <stop offset="55%" stopColor="#C87137" />
          <stop offset="100%" stopColor="#8E4A20" />
        </linearGradient>
      </defs>
      {/* V stroke */}
      <path
        d="M18 20 L44 76 L56 46"
        stroke="url(#vr-grad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* R stroke — bowl + leg */}
      <path
        d="M58 76 L58 22 L72 22 C84 22 86 40 72 44 L60 46 L84 76"
        stroke="url(#vr-grad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({
  size = 34,
  showTagline = false,
  className = "",
}: {
  size?: number;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <VRMark size={size} />
      <span className="leading-none">
        <span className="block font-display text-xl font-bold tracking-tight sm:text-2xl">
          <span className="brand-text">{SITE.brandLead}</span>{" "}
          <span className="text-foreground">{SITE.brandTail}</span>
        </span>
        {showTagline && (
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.25em] text-brand/70">
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
