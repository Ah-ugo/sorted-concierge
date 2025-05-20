// In preloader.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900"
          onAnimationComplete={() => setIsVisible(false)}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative h-16 w-16"
          >
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
              SC
            </span>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
