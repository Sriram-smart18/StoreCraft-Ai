"use client";

import { useState, useEffect } from "react";

export function TypingEffect({ content }: { content: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(content.slice(0, i + 1));
      i++;
      if (i >= content.length) {
        clearInterval(intervalId);
      }
    }, 15); // typing speed

    return () => clearInterval(intervalId);
  }, [content]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
}
