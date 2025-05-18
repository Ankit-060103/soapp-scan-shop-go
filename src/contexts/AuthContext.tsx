
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // This is a mock implementation. In a real app, you'd connect to Supabase here
  const login = async (email: string, password: string) => {
    try {
      // Mock login - in a real app, you'd validate credentials with Supabase
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
      };
      
      setUser(mockUser);
      localStorage.setItem("soapp_user", JSON.stringify(mockUser));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Mock signup - in a real app, you'd create a user in Supabase
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user but don't log in automatically
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
      };
      
      // Don't set the user in state anymore
      // Don't save to localStorage
      
      // Just notify of success
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("soapp_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Check for existing login on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("soapp_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("soapp_user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
