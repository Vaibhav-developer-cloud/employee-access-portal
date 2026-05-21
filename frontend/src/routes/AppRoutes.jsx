import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminRequests from "../pages/admin/Requests";
import Analytics from "../pages/admin/Analytics";
import EmployeeDashboard from "../pages/employee/Dashboard";
import EmployeeRequests from "../pages/employee/MyRequests";
import CreateRequest from "../pages/employee/CreateRequest";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute role="ADMIN">
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/requests"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/create"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}