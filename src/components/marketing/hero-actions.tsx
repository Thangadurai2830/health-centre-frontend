"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <Button size="lg" render={<Link href="/app" />}>
        Open application
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        render={
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/docs`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        View API docs
      </Button>
    </motion.div>
  );
}
