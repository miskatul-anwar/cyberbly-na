import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { visualizationGroups } from "@/lib/visualizations";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/55 backdrop-blur-2xl">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl outline-none focus:ring-2 focus:ring-sky-400"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white shadow-sm"
          >
            <BarChart3 className="h-4 w-4" />
          </span>

          <h1 className="text-sm font-semibold text-slate-950">
            Home
          </h1>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {Object.entries(visualizationGroups).map(([category, items]) => (
            <div key={category} className="group relative">
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/70"
                aria-haspopup="menu"
              >
                {category}
              </button>

              <div
                className="invisible absolute right-0 top-10 w-72 translate-y-1 rounded-2xl border border-white/70 bg-white/85 p-2 opacity-0 shadow-glass backdrop-blur-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                role="menu"
              >
                {items.map((item) => (
                  <Link
                    key={item.route}
                    href={item.route}
                    role="menuitem"
                    className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-white/70"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
