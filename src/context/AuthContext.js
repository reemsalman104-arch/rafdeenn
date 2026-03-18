import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser , loginUser , forgotPassword , logoutUser , deleteAccount, getProfile } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState('');
  const [loginform, setloginForm] = useState({
    email: "",
    password: "",
  });
   const [token, setToken] = useState(null);

  const [errors, setErrors] = useState({});

  // تحميل البيانات من localStorage عند التحميل
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("currentUser");
    const userRole = localStorage.getItem("userRole");
    
    
    console.log("Checking auth - token:", !!token, "email:", userEmail, "role:", userRole);
    
    if (token && userEmail) {
      setCurrentUser(userEmail);
      setRole(userRole);
      console.log("Auth restored from localStorage");
    }
    setIsCheckingAuth(false);
  }, []);

  const login = (email, userRole) => {
    console.log("Login called with:", email, userRole);
    localStorage.setItem("currentUser", email);
    localStorage.setItem("userRole", userRole);
    setCurrentUser(email);
    setRole(userRole);
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangelogin = (e) => {
    setloginForm({ ...loginform, [e.target.name]: e.target.value });
  };
   const handleChangepassword = (e) => {
    setEmail(e.target.value);
  };

  const validate = () => {
    let newErrors = {};

    const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;
    if (!form.name) {
      newErrors.name = "الاسم مطلوب";
    } else if (!nameRegex.test(form.name)) {
      newErrors.name = "الاسم يجب أن يحتوي على حروف فقط";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!form.password) {
      newErrors.password = "كلمة السر مطلوبة";
    } else if (form.password.length < 8) {
      newErrors.password = "كلمة السر يجب أن تكون 8 أحرف على الأقل";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "كلمتا السر غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
     if (!validate()) return;
    setIsLoading(true); 
    setErrors({});
    
try{

   

    const data = await registerUser ({name : form.name , email : form.email , phone : form.phone , password : form.password , password_confirmation: form.confirmPassword}); 

localStorage.setItem("token", data.token);

login(data.user?.email, data.user?.role);
 navigate("/wheel", { replace: true });
  
    }
      catch (error) {
        if(error.errors){
        setErrors( error.errors);}
        else{setErrors({server:" errorin enroll"});}}
      
      finally{setIsLoading(false);}}

    
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setIsLoading(true); 
    setErrors({});
   
    try {
      const data = await loginUser({ email: loginform.email, password: loginform.password }); 

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("currentUser", data.user.email);

      console.log("Login successful:", data.user.role, data.user.email);
      
      // تحديث state من خلال دالة login
      login(data.user.email, data.user.role);
      
      // التوجيه حسب الـ role
      if (data.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/wheel", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message) {
        setErrors({ server: "بيانات تسجيل الدخول غير صحيحة" });
      } else {
        setErrors({ server: "خطأ في تسجيل الدخول" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setErrors({});
    setMessage('');
   
    try {
      const result = await forgotPassword(email);
      console.log(result);
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (error) {
      console.log(error);
      setErrors({ server: "فشل في إرسال رابط إعادة تعيين كلمة المرور" });
    } finally {
      setIsLoading(false);
      setEmail('');
    }
  };
  
const logout = async () => {
  setIsLoading(true);
  try {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setRole(null);
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteAccount = async (password) => {
  try {
    const token = localStorage.getItem("token");
    const result = await deleteAccount(password, token);
    return result;
  } catch (error) {
    throw error;
  }
};

 const initiateGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "https://goget-ef.website/wheel/public/api/auth/login/google";
  };

  const handleGoogleToken = async (token) => {
    try {
      setIsLoading(true);
      // Save token from URL
      setToken(token);
      localStorage.setItem("token", token);
      
      // Fetch user profile using the token
      let userData = await getProfile();
      if (userData && userData.user) {
        userData = userData.user;
      }
      
      setCurrentUser(userData.email || userData.name);
      const userRole = userData.role || "user";
      setRole(userRole);
      localStorage.setItem("currentUser", userData.email || userData.name);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("currentUserName", userData.name);
      
      // Return user data and role (App.js ستتعامل مع التوجيه)
      return { ...userData, role: userRole };
    } catch (err) {
      console.error("Google token error:", err);
      setErrors({ server: "فشل تسجيل الدخول عبر Google" });
      // Clear token on error
      localStorage.removeItem("token");
      setToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      setIsLoading(true);
      // Send the authorization code to backend
      const res = await fetch("https://goget-ef.website/wheel/public/api/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error("Google login failed");
      }

      const data = await res.json();
      
      // Save token and user data
      setToken(data.token);
      localStorage.setItem("token", data.token);
      
      // Fetch user profile
      let userData = await getProfile();
      if (userData && userData.user) {
        userData = userData.user;
      }
      
      setCurrentUser(userData.email || userData.name);
      const userRole = data.user?.role || userData.role || "user";
      setRole(userRole);
      localStorage.setItem("currentUser", userData.email || userData.name);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("currentUserName", userData.name);
      
      // Return user data (App.js ستتعامل مع التوجيه)
      return { ...userData, role: userRole };
    } catch (err) {
      console.error("Google callback error:", err);
      setErrors({ server: "فشل تسجيل الدخول عبر Google" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


return (
  <AuthContext.Provider
    value={{
      form,
      errors,
      email,
      handleChangepassword,
      handleDeleteAccount,
      handleChange,
      handleRegister,
      login,
      isLoading,
      handleLogin,
      loginWithGoogle: handleGoogleToken,
      initiateGoogleLogin,
      handleGoogleCallback,
      loginform,
      handleChangelogin,
      handleForgotPassword,
      message,
      logout,
      currentUser,
      role,
      isCheckingAuth,
    }}
  >
    {children}
  </AuthContext.Provider>
);
}
