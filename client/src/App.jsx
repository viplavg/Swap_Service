import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyShifts from "./pages/ShiftsPage/MyShifts";
import CreateSwap from "./pages/CreateSwap/CreateSwap";
import MyRequests from "./pages/MyRequests/MyRequests";
import PendingRequests from "./pages/PendingRequests/PendingRequests";
import CreateShift from "./pages/CreateShift/CreateShift";
import AllShifts from "./pages/AllShifts/AllShifts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/shifts"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/create-swap"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <CreateSwap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/requests"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard/pending-requests"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard/create-shift"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <CreateShift />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard/shifts"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <AllShifts />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;