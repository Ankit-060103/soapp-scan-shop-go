
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle 
      pressed={theme === "dark"} 
      onPressedChange={toggleTheme} 
      aria-label="Toggle dark mode"
      className="p-2 rounded-md"
    >
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </Toggle>
  );
};

export default ThemeToggle;
