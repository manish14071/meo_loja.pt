"use client";
import { useEffect, useRef } from "react";
import { cn } from "../../utils/index.js";


export const BackgroundBeams = ({ className }) => {
  const beamsRef = useRef(null);

  useEffect(() => {
    const moveBeams = (e) => {
      if (!beamsRef.current) return;

      const { clientX, clientY } = e;
      const x = clientX - beamsRef.current.offsetLeft;
      const y = clientY - beamsRef.current.offsetTop;

      const rx = (x / beamsRef.current.offsetWidth) * 100;
      const ry = (y / beamsRef.current.offsetHeight) * 100;

      beamsRef.current.style.setProperty("--rx", `${rx}%`);
      beamsRef.current.style.setProperty("--ry", `${ry}%`);
    };

    window.addEventListener("mousemove", moveBeams);
    return () => window.removeEventListener("mousemove", moveBeams);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "absolute inset-0 overflow-hidden [--rx:50%] [--ry:50%]",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at var(--rx) var(--ry),
              rgba(255,255,255,0.8) 0%,
              rgba(255,255,255,0) 60%
            )
          `,
        }}
      />
    </div>
  );
}; 