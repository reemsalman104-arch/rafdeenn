import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, errors, handleLogin, initiateGoogleLogin, loginform, handleChangelogin } = useContext(AuthContext);

  const handleGoogleLogin = () => {
    try {
      initiateGoogleLogin();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // const [identifier, setIdentifier] = useState(""); // ايميل او رقم
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
// /
  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   const users = JSON.parse(localStorage.getItem("users")) || [];

  //   const user = users.find(
  //     (u) =>
  //       (u.email === identifier || u.phone === identifier) &&
  //       u.password === password
  //   );

  //   if (!user) {
  //     setError("بيانات الدخول غير صحيحة");
  //     return;
  //   }

  //   // Store user info (use name for greeting)
  //   localStorage.setItem("isUser", "true");
  //   localStorage.setItem("currentUser", user.email);
  //   localStorage.setItem("userRole", user.role);
  //   localStorage.setItem("currentUserName", user.name);

  //   // Redirect by role
  //   if (user.role === "admin") {
  //     navigate("/dashboard", { replace: true });
  //   } else {
  //     navigate("/wheel", { replace: true });
  //   }
  // };

  return (
    <div className="login-container">
      <h2>تسجيل دخول</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          name="email"
          placeholder="البريد الإلكتروني أو رقم الهاتف"
          value={loginform.email}
          onChange={ handleChangelogin}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={loginform.password}
           onChange={ handleChangelogin}
          required
        />

        {errors.server && <div className="error">{errors.server}</div>}

        <button type="submit" className="btn-login">
          {isLoading ? "...جاري الدخول" : "دخول"}
        </button>
        
        <div className="divider">أو</div>

        <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={isLoading}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLoading ? "...جاري التوجيه" : "تسجيل الدخول عبر Google"}
        </button>

        <p className="register-link">
          ليس لديك حساب؟{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn-register"
          >
            أنشئ حساب
          </button>
        </p>

        <div className="forgot-link">
          <Link to="/forgot-password">هل نسيت كلمة المرور؟</Link>
        </div>
      </form>

      {/* CSS */}
      <style>{`
        .login-container {
          max-width: 400px;
          margin: 80px auto;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 12px;
          background: #fff;
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }

        .btn-login {
          padding: 12px;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-login:hover {
          background-color: #45a049;
        }

        .btn-login:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .btn-google {
          padding: 12px;
          background-color: #fff;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
        }

        .btn-google:hover:not(:disabled) {
          border-color: #4285F4;
          background-color: #f9f9f9;
        }

        .btn-google:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          border-color: #ccc;
        }

        .error {
          color: red;
          font-size: 14px;
          text-align: center;
        }

        .divider {
          text-align: center;
          color: #999;
          margin: 20px 0;
          position: relative;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e0e0e0;
          z-index: 0;
        }

        .divider {
          background: #fff;
          position: relative;
          z-index: 1;
          padding: 0 10px;
        }

        .register-link {
          text-align: center;
          font-size: 14px;
          margin-top: 10px;
        }

        .btn-register {
          color: #2196f3;
          text-decoration: underline;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
        }

        .forgot-link {
          text-align: center;
          margin-top: 10px;
        }

        .forgot-link a {
          color: #ff5722;
          text-decoration: underline;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-container {
            margin: 40px 20px;
            padding: 20px;
          }

          input, .btn-login {
            font-size: 14px;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}