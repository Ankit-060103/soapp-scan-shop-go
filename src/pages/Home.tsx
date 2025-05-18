
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(
    location.state?.activeTab || "login"
  );

  // Update active tab when location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold soapp-gradient bg-clip-text text-transparent mb-2">
            SoApp
          </h1>
          <p className="text-gray-600">
            Scan, Shop, Simplify
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Scan NFC products and shop with ease</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
