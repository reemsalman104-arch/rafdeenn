import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function ForgotPassword() {
 
  
 const{isLoading ,message ,handleForgotPassword, email, handleChangepassword } =useContext(AuthContext)
  return (
    <div className="forgot-container">
      <h2>استعادة كلمة المرور</h2>

      <form onSubmit={handleForgotPassword} className="forgot-form">
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={ handleChangepassword }
          required
        />

        <button type="submit" className="btn-send">
          {isLoading ? "...قيد الارسال" : "ارسال"}

        </button>
         {message && <div className="message">{message}</div>}
        {/* {errors && <div className="message">{errors}</div>} */}
      </form>

     

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