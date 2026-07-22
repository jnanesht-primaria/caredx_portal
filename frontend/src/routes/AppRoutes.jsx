import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import AdminDashboard from "../pages/admin/Dashboard";
import TechnicianDashboard from "../pages/technician/Dashboard";
import ReceptionistDashboard from "../pages/receptionist/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Technician"]} />}>
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
