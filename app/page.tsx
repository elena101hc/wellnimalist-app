"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ensureProgramStartOnFirstLaunch,
  getOnboarded,
  setOnboarded,
} from "@/lib/schedule";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (getOnboarded()) {
      router.replace("/today");
    }
  }, [router]);

  function begin() {
    ensureProgramStartOnFirstLaunch();
    setOnboarded();
    router.push("/today");
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col justify-center gap-10 px-6 py-16 md:max-w-[560px]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6 text-center"
      >
        <p className="label-caps text-gold">Two-week rebuild</p>
        <h1 className="font-display text-balance text-4xl font-medium leading-tight text-ink md:text-[2.75rem]">
          Catorce días. Sin prisa.
        </h1>
        <p className="text-pretty text-base text-ink-soft">
          Un espacio para ordenar el cuerpo, nutrir el alma y volver a ti con
          ternura firme.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center"
      >
        <Button
          type="button"
          size="lg"
          className="h-12 rounded-full px-10 text-sm font-medium tracking-wide"
          onClick={begin}
        >
          Comenzar
        </Button>
      </motion.div>
    </div>
  );
}
