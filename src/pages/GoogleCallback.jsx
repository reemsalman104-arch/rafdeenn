import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // Send the code to backend for processing
          const user = await handleGoogleCallback(code);

          // Redirect based on user role
          if (user.role && user.role.toLowerCase() === "admin") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/wheel", { replace: true });
          }
        } else {
          // No code received, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Google callback error:", error);
        // Redirect to login on error
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, handleGoogleCallback]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4caf50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>جاري تسجيل الدخول عبر Google...</p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}