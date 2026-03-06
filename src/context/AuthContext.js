import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const login = (email, role) => {
    localStorage.setItem("currentUser", email);
    localStorage.setItem("userRole", role);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } else if (form.password.length < 6) {
      newErrors.password = "كلمة السر يجب أن تكون 6 أحرف على الأقل";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "كلمتا السر غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.find((u) => u.email === form.email);
    if (emailExists) {
      alert("البريد الإلكتروني مستخدم مسبقاً");
      return;
    }

    const newUser = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role: "user",
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUserName", newUser.name);
    login(newUser.email, newUser.role);

    alert("تم إنشاء الحساب 🎉");

    navigate("/wheel", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        form,
        errors,
        handleChange,
        handleRegister,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}