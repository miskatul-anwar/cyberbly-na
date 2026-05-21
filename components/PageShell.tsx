import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  compact?: boolean;
};

export default function PageShell({ children, compact }: PageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-6xl px-4 pb-28",
        compact ? "pt-5" : "pt-8 md:pt-10"
      )}
    >
      {children}
    </main>
  );
}
