
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaGoogle } from "react-icons/fa";

export default function Register() {

// داخل الـ component
const { form, errors, handleChange, handleRegister, isLoading } =
    useContext(AuthContext);


  
 


  return (
    <div className="register-container">
      <h2>إنشاء حساب</h2>

      <form onSubmit={handleRegister} className="register-form">
         <button  className="btn-google" style={{backgroundColor:'#3d62da', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px',borderRadius:'8px', border:'none'}} >
          <FaGoogle style={{ marginRight: "8px" ,color:'white' }} />
         {isLoading ? "...جاري التسجيل" : "تسجيل عن طريق جوجل"}
         
        </button>
        <input
          type="text"
          name="name"
          placeholder="الاسم الكامل"
          value={form.name}
          onChange={handleChange}
        />
        <div className="error">{errors.name}</div>

        <input
          type="text"
          name="phone"
          placeholder="رقم الهاتف (اختياري)"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
        />
       {errors.email && <div className="error">{errors.email[0]}</div>}

        <input
          type="password"
          name="password"
          placeholder="كلمة السر"
          value={form.password}
          onChange={handleChange}
        />
        <div className="error">{errors.password}</div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة السر"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <div className="error">{errors.confirmPassword}</div>

        <button type="submit" className="btn-register">
         {isLoading ? "...جاري التسجيل" : "تسجيل"}
        </button>
        {errors.server && <div className="error">{errors.server}</div>}
        
      </form>

      {/* CSS */}
      <style>{`
        .register-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 12px;
          background: #fff;
          font-family: Arial, sans-serif;
        }
         btn-google{  padding: 12px;
          background-color: #3d62da;
          color: white;
          font-size: 16px;

          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;width:80%}
        h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .register-form {
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

        .btn-register {
          padding: 12px;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .btn-register:hover {
          background-color: #45a049;
        }

        .error {
          color: red;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .register-container {
            margin: 40px 20px;
            padding: 20px;
          }

          input, .btn-register {
            font-size: 14px;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}