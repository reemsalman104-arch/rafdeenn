// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly }) {
  const { currentUser, role, isCheckingAuth } = useContext(AuthContext);

  // في حالة جاري التحقق من البيانات
  if (isCheckingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f0f",
          color: "#22c55e",
          fontSize: "18px",
        }}
      >
        جاري التحقق...
      </div>
    );
  }

  // إذا لم يكن مسجل دخول - اجعه للـ login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان adminOnly والـ role ليس admin - اجعه للـ wheel
  if (adminOnly && role !== "admin") {
    return <Navigate to="/wheel" replace />;
  }

  return children;
}