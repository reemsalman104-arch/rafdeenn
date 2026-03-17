import { useState, useEffect, useRef , useContext } from "react";
import "../foldcss/profile.css";
import { IoCloseOutline } from "react-icons/io5";
import { getProfile, verifyOtp, requestUpdateotp , changePassword } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function Profile() {
    const{handleDeleteAccount} = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("edit");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [tempData, setTempData] = useState({ name: "", email: "", phone: "" });
  const [previousAwards, setPreviousAwards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [userspin, setUserSpin] = useState({ prizeName: "", date: "", status: "" });
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const otpRefs = useRef([]);
  const [password, setPassword] = useState("");
   const [showDeleteModal, setShowDeleteModal] = useState(false); 


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const user = data?.user ?? data;
        setUserData(user);
        setTempData({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
        setPreviousAwards(user?.spins ?? user?.previous_awards ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = { name: "", email: "", phone: "", otp: "" };
    if (!tempData.name || !tempData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!tempData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    setFormErrors(errors);
    return !errors.name && !errors.email;
  };

  const sendUpdateOtp = async (tempData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await requestUpdateotp(tempData, token);
      if (result?.error === "email_taken" || result?.message === "email_taken") {
        setFormErrors((prev) => ({ ...prev, email: "This email is already taken." }));
        setLoading(false);
        return null;
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      if (
        error?.response?.data?.message === "email_taken" ||
        error?.message?.toLowerCase().includes("email taken")
      ) {
        setFormErrors((prev) => ({ ...prev, email: "This email is already taken." }));
      } else {
        setFormErrors((prev) => ({ ...prev, otp: "حدث خطأ، حاول مرة أخرى." }));
      }
      return null;
    }
  };

  const confirmOtp = async (email, otp) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await verifyOtp(email, otp, token);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleVerify = async () => {
    const otp = otpCode.join("");
    if (otp.length !== 4) {
      setFormErrors((prev) => ({ ...prev, otp: "Please enter the 4-digit OTP." }));
      return;
    }

    try {
      await confirmOtp(tempData.email, otp);
      setUserData({ ...tempData });
      setShowVerify(false);
      setOtpCode(["", "", "", ""]);
      setFormErrors({ name: "", email: "", phone: "", otp: "" });
    } catch (error) {
      setFormErrors((prev) => ({ ...prev, otp: "Invalid OTP. Please try again." }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await sendUpdateOtp(tempData);
    if (result) {
      setFormErrors((prev) => ({ ...prev, otp: "" }));
      setShowVerify(true);
      setOtpCode(["", "", "", ""]);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 10);
    }
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpCode];
    next[index] = value;
    setOtpCode(next);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
const handleChangePassword = async () => {
    setPasswordMessage("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("أدخل جميع حقول كلمة السر.");
      return;
    }
     if (newPassword !== confirmPassword) {
      setPasswordMessage("كلمات السر الجديدة لا تطابق.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await changePassword(currentPassword, newPassword, confirmPassword, token);
      setPasswordMessage("تم تغيير كلمة السر بنجاح.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPasswordMessage(err?.message || "فشل تغيير كلمة السر.");
    }}


        const handleDeleteClick = async () => { setPasswordMessage('') 
          try {    await handleDeleteAccount(password); 
               localStorage.removeItem("token");   
                navigate("/login");  } 
                catch (error) {    setPasswordMessage(error.message);  } };
  return (
    <div className="profile-container">
      {showVerify && (
        <div  className="dashboard">
          <div className="verify-overlay">
            <div className="verify-box">
              <button className="close-btn" onClick={() => setShowVerify(false)}>
                <IoCloseOutline />
              </button>
              <h3>الرجاء ادخال رمز التحقق</h3>
              <div className="code-inputs" style={{ display: "flex", gap: "10px" }}>
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    style={{ width: "40px", height: "40px", textAlign: "center", fontSize: "18px" }}
                  />
                ))}
              </div>
              {formErrors.otp && <div className="error" style={{ marginTop: "8px" }}>{formErrors.otp}</div>}
              <button className="verify-btn" onClick={handleVerify}>
                {loading ? "جاري التحقق..." : "تحقق"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (  
        <div  className="verify-overlay">    
        <div className='verify-box'>    
          <h3>Delete Account</h3>     
           <p>Enter your password to confirm:</p>    
             <input 
             className="input-modal"       
             type="password"        
             placeholder="Password"        
             value={password}        
           onChange={(e) => setPassword(e.target.value)}      />     
       {passwordMessage && <p className="error">{passwordMessage}</p>}    
         <div  >      
         <button className="verify-btn" onClick={handleDeleteClick}>Delete</button>      
           <button className="close-btn" onClick={() => setShowDeleteModal(false)}><IoCloseOutline /></button>    
             </div>   
              </div>  
              </div> )}

      <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰ القائمة</button>

      <div className={`profile-sidebar ${menuOpen ? "show" : ""}`}>
        <h3 className="sidebar-title">حسابي</h3>
        <button className={activeTab === "edit" ? "active-btn" : "side-btn"} onClick={() => { setActiveTab("edit"); setMenuOpen(false); }}>تعديل البيانات</button>
        <button className={activeTab === "prizes" ? "active-btn" : "side-btn"} onClick={() => { setActiveTab("prizes"); setMenuOpen(false); }}>الجوائز السابقة</button>
        <button className={activeTab === "prizes" ? "active-btn" : "side-btn"} onClick={() => navigate("/wheel")}>العودة الى الدولاب</button>
        <button className={activeTab === "password" ? "active-btn" : "side-btn"} onClick={() => { setActiveTab("password"); setMenuOpen(false); }}>تغيير كلمة السر</button>
        <button className={activeTab === "delete" ? "delete-active" : "delete-btn"} onClick={() => { setActiveTab("delete"); setMenuOpen(false); }}>حذف الحساب</button>
      </div>

      <div className="profile-content">
        {activeTab === "edit" && (
          <div>
            <h2>تعديل البيانات</h2>
            <input className="profile-input" placeholder="الاسم" value={tempData.name} onChange={(e) => setTempData((prev) => ({ ...prev, name: e.target.value }))} />
            {formErrors.name && <div className="error">{formErrors.name}</div>}
            <input className="profile-input" placeholder="رقم الهاتف" value={tempData.phone} onChange={(e) => setTempData((prev) => ({ ...prev, phone: e.target.value }))} />
            <input className="profile-input" placeholder="البريد الإلكتروني" value={tempData.email} onChange={(e) => setTempData((prev) => ({ ...prev, email: e.target.value }))} />
            {formErrors.email && <div className="error">{formErrors.email}</div>}
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? "جاري الحفظ" : "حفظ التعديلات"}
            </button>
          </div>
        )}

        {activeTab === "prizes" && (
          <div className="tablecontainer">
            <h2>الجوائز السابقة</h2>
            <table className="profile-table">
              <thead>
                <tr>
                  <th>اسم الجائزة</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {previousAwards?.length > 0 ? (
                  previousAwards.map((award, index) => (
                    <tr key={index}>
                      <td>{award?.prize_name ?? award?.name ?? "غير موجود"}</td>
                      <td>{award?.date ?? award?.created_at ?? "غير متوفر"}</td>
                      <td>{award?.status ?? "مفتوح"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      لا توجد جوائز سابقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "password" && (
          <div>
            <h2>تغيير كلمة السر</h2>
             <input
            className="profile-input"
            type="password"
            placeholder="كلمة السر الحالية"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
  <input
            className="profile-input"
            type="password"
            placeholder="كلمة السر الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="profile-input"
            type="password"
            placeholder="تأكيد كلمة السر الجديدة"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
           <button className="save-btn" onClick={handleChangePassword}>
            تغيير كلمة السر
          </button>
          {passwordMessage && <div className="error" style={{ marginTop: 8 }}>{passwordMessage}</div>}
        </div>
        )}

        {activeTab === "delete" && (
          <div>
            <h2 className="delete-title">حذف الحساب</h2>
            <p>هذا الإجراء لا يمكن التراجع عنه.</p>
            <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
              حذف حسابي نهائياً
            </button>
          </div>
        )}
      </div>
    </div>
  );
}