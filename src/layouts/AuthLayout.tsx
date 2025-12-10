import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
    <Outlet />
    // </div>
  );
};
