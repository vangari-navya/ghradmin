import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { FormSection } from "./pages/FormSection";
import { JobManagement } from "./pages/JobManagement";
import { Navigate, Outlet } from "react-router";

// 🔐 Protected Route (same file)
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  console.log("isAuthenticated",isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },

  // 🔐 Wrap protected routes
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/dashboard",
        Component: Dashboard,
        children: [
          { index: true, Component: FormSection },
          { path: "forms", Component: FormSection },
          { path: "jobs", Component: JobManagement },
        ],
      },
    ],
  },
]);