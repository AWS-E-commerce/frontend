import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* This renders the child routes (Home, Products, etc.) */}
      </main>
      <Footer />
    </div>
  );
};