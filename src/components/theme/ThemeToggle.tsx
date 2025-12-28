"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@/components/ui/Icon";

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const title = useMemo(() => {
    return isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }, [isDark]);

  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={() => {
        const root = document.documentElement;
        root.setAttribute("data-theme-transition", "");
        window.setTimeout(() => root.removeAttribute("data-theme-transition"), 320);

        setTheme(isDark ? "light" : "dark");
      }}
      className={
        `inline-flex items-center justify-center rounded-xl p-2 ui-surface hover:ui-shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-muted hover:text-foreground ${className}`
      }
    >
      {isDark ? <Icon name="Sun" size="input" decorative /> : <Icon name="Moon" size="input" decorative />}
    </button>
  );
}
