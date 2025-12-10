import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { Toast } from "@/components/common/Toast/Toast";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* <Toast /> Add toast notifications */}
    </div>
  );
};
