import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Wheell from "./pages/Wheel";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

function App() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    // إذا كان هناك token من Google في URL
    if (tokenFromUrl) {
      loginWithGoogle(tokenFromUrl)
        .then((userData) => {
          // قم بتنظيف URL بدون إعادة التحميل
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // التوجيه حسب الـ role
          const userRole = localStorage.getItem("userRole");
          if (userRole && userRole.toLowerCase() === "admin") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/wheel", { replace: true });
          }
          
          console.log("Google token processed successfully");
        })
        .catch((error) => {
          console.error("Error handling Google token:", error);
          // في حالة الخطأ، نوجه إلى صفحة الدخول
          navigate("/login", { replace: true });
        });
      return;
    }
    
    // تسجيل الدخول العادي - توجيه المستخدمين المسجلين
    const localToken = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (localToken && (window.location.pathname === "/" || window.location.pathname === "/login")) {
      if (role && role.toLowerCase() === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/wheel", { replace: true });
      }
    }
  }, [navigate, loginWithGoogle]);

  return (
    
      <Routes>
        {/* Login & Register (عام للجميع) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* الصفحات المحمية (تتطلب تسجيل دخول) */}
        <Route path="/wheel" element={<ProtectedRoute><Wheell /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Dashboard (يتطلب admin فقط) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    
  );
}

export default App;
