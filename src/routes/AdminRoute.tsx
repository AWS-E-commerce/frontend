import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  // const { isLoading } = useSession();

  // if (isLoading) {
  //   console.log("Loading from AdminRoute");
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  if (!isAuthenticated) {
    console.log("Not authenticated from AdminRoute");
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin()) {
    console.log("Not admin from AdminRoute");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
