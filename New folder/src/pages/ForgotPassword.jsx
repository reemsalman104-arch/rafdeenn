import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      setMessage("البريد الإلكتروني غير موجود");
      return;
    }

    // هنا المفروض يصير ارسال ايميل من backend
    setMessage("تم إرسال رسالة التحقق إلى بريدك الإلكتروني ✅");
  };

  return (
    <div className="forgot-container">
      <h2>استعادة كلمة المرور</h2>

      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="btn-send">
          إرسال
        </button>
      </form>

      {message && <div className="message">{message}</div>}

      <style>{`
        .forgot-container {
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

        .forgot-form {
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

        .btn-send {
          padding: 12px;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-send:hover {
          background-color: #45a049;
        }

        .message {
          margin-top: 15px;
          text-align: center;
          color: #2196f3;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .forgot-container {
            margin: 40px 20px;
            padding: 20px;
          }

          input, .btn-send {
            font-size: 14px;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}