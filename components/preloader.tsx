"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent body scroll during preloader
    document.body.classList.add("preloader-active");

    // Remove body scroll lock and hide preloader after animation
    const timer = setTimeout(() => {
      document.body.classList.remove("preloader-active");
      setIsVisible(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("preloader-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preloader-container">
      {/* Slide In from Left */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
      >
        <div className="text-center">
          {/* Animated logo/brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.h1
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="text-5xl md:text-6xl font-cinzel font-bold gold-accent tracking-widest"
            >
              SORTED
            </motion.h1>
          </motion.div>

          {/* Animated line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
            className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mb-6"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-sm md:text-base font-lora uppercase tracking-[0.3em] text-gray-300"
          >
            Concierge Experience
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "linear",
              }}
              className="w-8 h-8 border border-gold-accent border-t-transparent rounded-full mx-auto"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Out to Right */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 0.8,
          delay: 2.5,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[59] bg-gradient-to-r from-black via-gray-900 to-black"
      />

      {/* Final reveal panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 0.6,
          delay: 2.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[58] bg-gradient-to-r from-black/80 to-transparent"
      />
    </div>
  );
}
