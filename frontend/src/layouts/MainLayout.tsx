import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OnboardingTour from "../components/ui/OnboardingTour";

export const MainLayout: React.FC = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem("hasCompletedTour");
    if (!hasCompleted) {
      // Activa automáticamente el tour en el primer ingreso tras 500ms
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenTour={() => setIsTourOpen(true)} />
        <main className="flex-1 p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
