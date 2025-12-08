import { useState, useEffect } from "react";

export function useFitScale(containerRef, contentWidth, contentHeight, padding = 40) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current || !contentWidth || !contentHeight) return;

    const container = containerRef.current;
    const maxWidth = container.clientWidth - padding;
    const maxHeight = container.clientHeight - padding;

    const fitScale = Math.min(maxWidth / contentWidth, maxHeight / contentHeight, 1);
    setScale(fitScale);
  }, [containerRef, contentWidth, contentHeight, padding]);

  return scale;
}
