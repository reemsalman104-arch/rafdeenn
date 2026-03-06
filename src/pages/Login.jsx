import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // ايميل او رقم
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        (u.email === identifier || u.phone === identifier) &&
        u.password === password
    );

    if (!user) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }

    // Store user info (use name for greeting)
    localStorage.setItem("isUser", "true");
    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("currentUserName", user.name);

    // Redirect by role
    if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/wheel", { replace: true });
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل دخول</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="البريد الإلكتروني أو رقم الهاتف"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-login">
          دخول
        </button>

        <p className="register-link">
          ليس لديك حساب؟{" "}
          <button
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

        .error {
          color: red;
          font-size: 14px;
          text-align: center;
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