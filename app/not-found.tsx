import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="rounded-[2rem] border border-white/60 bg-white/60 p-8 text-center shadow-glass backdrop-blur-2xl">
        <p className="text-sm font-medium text-sky-700">Not found</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Visualization unavailable
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          The requested reviewer visualization route does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Return home
        </Link>
      </section>
    </PageShell>
  );
}
