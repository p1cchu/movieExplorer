
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder button to maintain layout consistency with the server render.
    // The actual icon depends on the theme, which is resolved on the client.
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled // Disable interaction until mounted and theme is known
        className="rounded-full transition-colors duration-300 hover:bg-accent/50 w-10 h-10" // Ensure consistent size
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="rounded-full transition-colors duration-300 hover:bg-accent/50"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </Button>
  );
}
