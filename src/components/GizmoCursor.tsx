"use client";

import { useEffect, useRef } from "react";

export default function GizmoCursor() {
  const circleRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const circle = circleRef.current;
    const hLine = hLineRef.current;
    const vLine = vLineRef.current;
    if (!circle || !hLine || !vLine) return;

    circle.style.display = "block";
    hLine.style.display = "block";
    vLine.style.display = "block";

    const handler = (e: MouseEvent) => {
      circle.style.left = e.clientX + "px";
      circle.style.top = e.clientY + "px";
      hLine.style.top = e.clientY + "px";
      vLine.style.left = e.clientX + "px";
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      {/* Circle */}
      <div
        ref={circleRef}
        className="fixed w-[100px] h-[100px] border border-white/30 rounded-full pointer-events-none z-[100] hidden"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Horizontal line */}
      <div
        ref={hLineRef}
        className="fixed left-0 w-full h-px pointer-events-none z-[99] hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      />
      {/* Vertical line */}
      <div
        ref={vLineRef}
        className="fixed top-0 h-full w-px pointer-events-none z-[99] hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      />
    </>
  );
}
