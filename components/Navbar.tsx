"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Network,
  Home,
  Menu,
  X,
  ChevronDown,
  Share2,
  Users,
  Waves,
  GitBranch,
  Boxes,
  Layers,
} from "lucide-react";
import { visualizationGroups } from "@/lib/visualizations";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Icon helpers — inline JSX, same pattern as VisualizationViewer / Card
// ---------------------------------------------------------------------------

function getCategoryIcon(category: string) {
  switch (category) {
    case "Network Structure":
      return <Share2 className="h-4 w-4" aria-hidden="true" />;
    case "Community Interaction":
      return <Users className="h-4 w-4" aria-hidden="true" />;
    case "Diffusion Visualization":
      return <Waves className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Layers className="h-4 w-4" aria-hidden="true" />;
  }
}

function getCategoryIconSm(category: string) {
  switch (category) {
    case "Network Structure":
      return <Share2 className="h-3 w-3" aria-hidden="true" />;
    case "Community Interaction":
      return <Users className="h-3 w-3" aria-hidden="true" />;
    case "Diffusion Visualization":
      return <Waves className="h-3 w-3" aria-hidden="true" />;
    default:
      return <Layers className="h-3 w-3" aria-hidden="true" />;
  }
}

function getItemIcon(title: string) {
  switch (title) {
    // Network Structure
    case "Perpetrator Similarity Network":
      return <GitBranch className="h-4 w-4" aria-hidden="true" />;
    case "Perpetrator Community Network":
      return <Share2 className="h-4 w-4" aria-hidden="true" />;
    case "Perpetrator Sub-community Network":
      return <Boxes className="h-4 w-4" aria-hidden="true" />;
    // Community Interaction
    case "Community Behavior Graph":
      return <Users className="h-4 w-4" aria-hidden="true" />;
    case "Community Context Graph":
      return <Network className="h-4 w-4" aria-hidden="true" />;
    // Diffusion Visualization
    case "Diffusion — All Methods":
      return <Waves className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Layers className="h-4 w-4" aria-hidden="true" />;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface VisualizationItem {
  id: string;
  title: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Root Navbar
// ---------------------------------------------------------------------------
export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav
        aria-label="Primary navigation"
        className={cn(
          "relative mx-auto max-w-6xl overflow-visible",
          "rounded-[1.75rem]",
          "border border-white/40",
          "bg-white/25",
          "shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "backdrop-blur-3xl",
        )}
      >
        {/* Specular top-edge highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-5">
          {/* Brand */}
          <BrandLogo />

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            <NavLink href="/" active={pathname === "/"}>
              <Home className="h-4 w-4" aria-hidden="true" />
              Home
            </NavLink>

            {Object.entries(visualizationGroups).map(([category, items]) => (
              <DropdownMenu
                key={category}
                category={category}
                items={items as VisualizationItem[]}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Mobile hamburger */}
          <MobileNavbar pathname={pathname} />
        </div>
      </nav>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Brand logo
// ---------------------------------------------------------------------------
function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-2xl px-2 py-2",
        "outline-none transition-all duration-200",
        "hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-sky-400",
      )}
    >
      <Image
        src="/logo.webp"
        alt=""
        width={64}
        height={43}
        className="h-10 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:scale-[1.06]"
      />

      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tracking-tight text-slate-950">
          Supplementary Viewer
        </span>
        <span className="block truncate text-[11px] text-slate-500">
          Anonymous review-only access
        </span>
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Desktop pill nav-link
// ---------------------------------------------------------------------------
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium",
        "transition-all duration-200",
        active
          ? "bg-slate-950 text-white shadow-[0_2px_8px_rgba(15,23,42,0.25)]"
          : "text-slate-700 hover:bg-white/40 hover:text-slate-950",
      )}
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Desktop dropdown
// ---------------------------------------------------------------------------
function DropdownMenu({
  category,
  items,
  pathname,
}: {
  category: string;
  items: VisualizationItem[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl px-3 py-2",
          "text-sm font-medium text-slate-700",
          "transition-all duration-200",
          "hover:bg-white/40 hover:text-slate-950",
          open && "bg-white/40 text-slate-950",
        )}
      >
        {getCategoryIcon(category)}
        <span>{category}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Liquid-glass dropdown panel */}
      <div
        inert={!open}
        className={cn(
          "absolute right-0 top-full mt-2 w-80 origin-top",
          "before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-['']",
          "rounded-[1.5rem]",
          "border border-slate-200 bg-white",
          "p-2",
          "shadow-[0_24px_64px_rgba(15,23,42,0.18),0_2px_12px_rgba(15,23,42,0.08)]",
          "transition-all duration-200",
          open
            ? "pointer-events-auto scale-100 translate-y-0 opacity-100"
            : "pointer-events-none scale-95 translate-y-2 opacity-0",
        )}
      >
        {items.map((item) => {
          const active = pathname === item.route;

          return (
            <Link
              key={item.id}
              href={item.route}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-start gap-3 rounded-2xl px-3 py-3 text-sm",
                "transition-all duration-150",
                active
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-800 hover:bg-slate-100/80 hover:text-slate-950",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl",
                  active ? "bg-white/15 text-white" : "bg-sky-100 text-sky-700",
                )}
              >
                {getItemIcon(item.title)}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] font-semibold">
                  {item.title}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate text-xs font-medium",
                    active ? "text-white/60" : "text-slate-500",
                  )}
                >
                  {category}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile navbar
// ---------------------------------------------------------------------------
function MobileNavbar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const onBreakpointChange = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktopQuery.addEventListener("change", onBreakpointChange);
    onBreakpointChange();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onBreakpointChange);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={cn(
          "grid h-10 w-10 place-items-center rounded-2xl",
          "border border-white/50 bg-white/35 text-slate-800",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl",
          "transition-all duration-200",
          "hover:bg-white/55 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        )}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "absolute left-3 right-3 top-[5.25rem] origin-top",
          "rounded-[1.75rem]",
          "border border-slate-200 bg-white",
          "p-3",
          "shadow-[0_24px_80px_rgba(15,23,42,0.18),0_2px_12px_rgba(15,23,42,0.08)]",
          "transition-all duration-200",
          open
            ? "pointer-events-auto scale-100 translate-y-0 opacity-100"
            : "pointer-events-none scale-95 -translate-y-3 opacity-0",
        )}
      >
        {/* Home link */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={cn(
            "mb-2 flex items-center gap-3 rounded-2xl px-3 py-3",
            "text-sm font-semibold transition-all duration-150",
            pathname === "/"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-800 hover:bg-slate-100/80 hover:text-slate-950",
          )}
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>

        {/* Divider */}
        <div className="mx-3 mb-3 h-px bg-slate-200/70" aria-hidden="true" />

        {/* Scrollable group list */}
        <div className="max-h-[calc(100svh-10rem)] space-y-4 overflow-y-auto pr-1">
          {Object.entries(visualizationGroups).map(([category, items]) => (
            <section key={category}>
              {/* Category label */}
              <div className="mb-1 flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {getCategoryIconSm(category)}
                {category}
              </div>

              <div className="space-y-0.5">
                {(items as VisualizationItem[]).map((item) => {
                  const active = pathname === item.route;

                  return (
                    <Link
                      key={item.id}
                      href={item.route}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5",
                        "text-sm font-semibold transition-all duration-150",
                        active
                          ? "bg-slate-950 text-white shadow-sm"
                          : "text-slate-800 hover:bg-slate-100/80 hover:text-slate-950",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                          active
                            ? "bg-white/15 text-white"
                            : "bg-sky-100 text-sky-700",
                        )}
                      >
                        {getItemIcon(item.title)}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
