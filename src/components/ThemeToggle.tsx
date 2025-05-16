
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
        "relative h-9 w-9 rounded-full transition-colors",
        isDark ? "bg-sidebar-accent border-sidebar-border text-yellow-200" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
      )}
    >
      <Sun className={cn("h-4 w-4 absolute transition-all", isDark ? "opacity-0 scale-0" : "opacity-100 scale-100")} />
      <Moon className={cn("h-4 w-4 absolute transition-all", isDark ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
