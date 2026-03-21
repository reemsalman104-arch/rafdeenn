import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser , loginUser , forgotPassword , logoutUser } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
const[isLoading, setIsLoading] = useState(false);
const[email, setEmail] = useState('');
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const[message, setMessage] = useState('');
   const [loginform, setloginForm] = useState({
    email: "",
    password: "",
     });


  const [errors, setErrors] = useState({});

  const login = (email, role) => {
    localStorage.setItem("currentUser", email);
    localStorage.setItem("userRole", role);
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
    
    //  if (!validate()) return;
    setIsLoading(true); 
    setErrors({});
   
    
try{

   

    const data = await loginUser ({ email : loginform.email , password : loginform.password }); 

localStorage.setItem("token", data.token);
localStorage.setItem("userRole", data.user.role);


console.log(data.user.role)
//  navigate("/wheel", { replace: true });
  if (data.user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/wheel", { replace: true });
    }
  
    }
      catch (error) {
        if(error.message){
        setErrors( {server:"بيانات تسجيل الدخول غير صحيحة"});}
      }
      
      finally{setIsLoading(false);}}

    const handleForgotPassword = async (event) => {
  event.preventDefault();
  setIsLoading(true); 
  setErrors({});
  setMessage('');
 

  try {
   const result = await forgotPassword(email);
   console.log(result);
   setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");

     
    
   
  } catch (error) {
    console.log(error);
    alert('err')
   // setErrors({ server: error.message || "فشل في إرسال رابط إعادة تعيين كلمة المرور" });
    //throw new Error( "فشل في إرسال رابط إعادة تعيين كلمة المرور");
  } finally {
    setIsLoading(false);
    setEmail('');
  }
};
  
const logout = async () => {
  setIsLoading(true);
  try {
    await logoutUser();
    
    navigate("/login", { replace: true });
  } 
  catch {} 
  
finally {
    setIsLoading(false);
   localStorage.removeItem("token");
  }}

  return (
    <AuthContext.Provider
      value={{
        form,
        errors,email, handleChangepassword ,
        handleChange,
        handleRegister,
        login,isLoading,handleLogin ,loginform 
        , handleChangelogin ,handleForgotPassword ,message, logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}