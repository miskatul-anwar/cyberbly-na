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
    "grid h-10 w-10 place-items-center rounded-xl border border-white/60",
    "bg-white/50 text-slate-700 shadow-sm backdrop-blur-xl transition",
    "hover:bg-white/70 hover:border-white/80",
    "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        className={className}
      >
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
      <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/40 p-2 shadow-lg shadow-slate-400/20 backdrop-blur-2xl">
        <DockButton label="Home" href="/">
          <Home className="h-5 w-5" />
        </DockButton>

        <div className="w-px h-6 bg-white/20" />

        <DockButton label="Back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </DockButton>
      </div>
    </div>
  );
}
