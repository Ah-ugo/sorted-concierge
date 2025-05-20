"use client";
import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "glow-cursor";
    document.body.appendChild(glow);
    const handleMouseMove = (e: MouseEvent) => {
      glow.style.left = `${e.clientX - 10}px`;
      glow.style.top = `${e.clientY - 10}px`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      glow.remove();
    };
  }, []);

  return null;
}
