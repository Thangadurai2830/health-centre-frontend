import { ShieldCheck, Zap } from "lucide-react";

import { LandingLayout } from "@/components/layouts/landing-layout";
import { HeroActions } from "@/components/marketing/hero-actions";
import { Separator } from "@/components/ui/separator";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Reliable by default",
    description:
      "Structured logging, health probes, and graceful shutdown are built in from day one.",
  },
  {
    icon: Zap,
    title: "Ready to scale",
    description:
      "An async PostgreSQL and Redis foundation designed for the stages ahead.",
  },
] as const;

export default function HomePage() {
  return (
    <LandingLayout>
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center sm:py-36">
        <span className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          Stage 1 &middot; Foundation
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          A production-ready foundation for SwasthyaSetu
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          FastAPI, PostgreSQL, and Redis on the backend. Next.js and shadcn/ui on the
          frontend. No shortcuts, no speculative features&mdash;just the platform groundwork.
        </p>
        <HeroActions />
      </section>

      <Separator />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 sm:grid-cols-2">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="flex flex-col gap-3 rounded-xl border border-border/60 p-6"
            >
              <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-medium">{pillar.title}</h2>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          );
        })}
      </section>
    </LandingLayout>
  );
}
