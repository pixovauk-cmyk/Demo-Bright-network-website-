"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
  numberClassName?: string;
}

export default function StatCounter({
  value, suffix = "", prefix = "", label, delay = 0,
  numberClassName = "text-5xl md:text-6xl font-black text-[#040B18] leading-none",
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, delay, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, value, delay, count]);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={numberClassName}>
        {prefix}<motion.span>{rounded}</motion.span>{suffix}
      </div>
      {label && <div className="text-slate-400 text-sm font-medium mt-1">{label}</div>}
    </motion.div>
  );
}
