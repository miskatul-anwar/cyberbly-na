"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type DockButtonProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
};

function DockButton({ label, children, onClick, href }: DockButtonProps) {
  const className = cn(
    "grid h-10 w-10 place-items-center rounded-[0.875rem]",
    "border border-white/50 bg-white/40 text-slate-700",
    "shadow-[0_2px_8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
    "backdrop-blur-xl transition-all duration-200",
    "hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/60",
    "hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]",
    "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
    "active:scale-95",
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

export default function BottomDock() {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {/* Dock pill */}
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-full",
          "border border-white/50 bg-white/35",
          "shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "backdrop-blur-2xl",
          "p-2",
        )}
      >
        {/* Specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />

        <DockButton label="Home" href="/">
          <Home className="h-5 w-5" aria-hidden="true" />
        </DockButton>

        {/* Divider */}
        <div className="h-6 w-px bg-white/30" aria-hidden="true" />

        <DockButton label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </DockButton>
      </div>
    </div>
  );
}