import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth < breakpoint ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  });

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < breakpoint;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isSmallScreen || (isSmallScreen && isTouchDevice));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

