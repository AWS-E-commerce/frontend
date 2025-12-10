import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

// Customer pages
import Home from "@/pages/customer/Home"; // ← Your new homepage
import Products from "@/pages/customer/Products";
import ProductDetail from "@/pages/customer/ProductDetail";
import Cart from "@/pages/customer/Cart";
import Checkout from "@/pages/customer/Checkout";
import OrderSuccess from "@/pages/customer/OrderSuccess";
import Orders from "@/pages/customer/Orders";
import Profile from "@/pages/customer/Profile";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
// import AdminCustomers from '@/pages/admin/Customers';

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Other
import NotFound from "@/pages/NotFound";
import AdminInventory from "@/pages/admin/Inventory";
import Variants from "@/pages/admin/Variants";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wraps with Header + Footer
    children: [
      {
        index: true,
        element: <Home />, // ← This is your homepage at "/"
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      // Protected customer routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "order-success/:orderId",
            element: <OrderSuccess />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "inventory",
            element: <AdminInventory />,
          },
          {
            path: "variants",
            element: <Variants />,
          },
        ],
      },
    ],
  },
  // Auth routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
