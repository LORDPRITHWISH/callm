"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import SoundVisualizer from "@/components/AudioVisualizer";

// Use dynamic import with no SSR for the sound visualizer
const SoundVisualizer = dynamic(() => import("@/components/AudioVisualizer"), {
  ssr: false,
});

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Update dimensions on client-side only
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="w-screen h-screen">
      <SoundVisualizer audioUrl="/assets/Beats.mp3" width={dimensions.width} height={dimensions.height} />
    </main>
  );
}
