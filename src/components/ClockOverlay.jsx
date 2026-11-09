import React, { useState, useEffect } from 'react';

const RELAXATION_QUOTES = [
  "Peace is found in the gentle glow.",
  "Breathe in the warmth, let go of the day.",
  "Rest deeply. The embers keep watch.",
  "Quiet mind, cozy heart, tranquil sleep.",
  "Soft crackling logs, soothing starry night.",
];

export default function ClockOverlay({ isVisible }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % RELAXATION_QUOTES.length);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  if (!isVisible) return null;

  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="absolute top-8 left-8 pointer-events-none z-20 transition-opacity duration-700 select-none">
      <div className="text-4xl md:text-5xl font-extralight tracking-widest text-amber-100/80 drop-shadow-[0_2px_12px_rgba(249,115,22,0.35)]">
        {timeString}
      </div>
      <div className="text-xs uppercase tracking-widest text-orange-300/70 mt-1 font-medium">
        {dateString}
      </div>
      <div className="text-xs italic text-amber-200/40 mt-2 font-serif max-w-xs transition-opacity duration-1000">
        "{RELAXATION_QUOTES[quoteIndex]}"
      </div>
    </div>
  );
}

