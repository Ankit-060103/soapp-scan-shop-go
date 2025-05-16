
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "relative h-9 w-9 rounded-full transition-all duration-300",
        isDark 
          ? "bg-sidebar-accent border-sidebar-border text-yellow-300 hover:text-yellow-200 hover:bg-sidebar-accent/80" 
          : "bg-white/15 border-white/20 text-white hover:bg-white/25"
      )}
    >
      <Sun className={cn(
        "h-4 w-4 absolute transition-all duration-300",
        isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
      )} />
      <Moon className={cn(
        "h-4 w-4 absolute transition-all duration-300",
        isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
