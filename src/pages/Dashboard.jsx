import { useState, useEffect } from "react";
import { getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../foldcss/profile.css"; // reuse styling or change to dashboard.css.

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProfile();
        const user = response?.user ?? response;
        setProfile(user);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ في جلب بيانات الحساب.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpins =
    profile?.stats?.total_spins ??
    profile?.spins?.length ??
    profile?.total_spins ??
    0;
  const totalPrizes =
    profile?.stats?.total_prizes ??
    profile?.prizes?.length ??
    profile?.total_prizes ??
    0;

  if (loading) {
    return (
      <div className="profile-container">
        <h2>لوحة التحكم</h2>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>لوحة التحكم</h2>
      {error && <div className="error">{error}</div>}
      <div className="dashboard-card">
        <h3>معلومات المستخدم</h3>
        <p>الاسم: {profile?.name ?? "غير متوفر"}</p>
        <p>البريد: {profile?.email ?? "غير متوفر"}</p>
        <p>رقم الجوال: {profile?.phone ?? "غير متوفر"}</p>
      </div>

      <div className="dashboard-card">
        <h3>إحصائيات سريعة</h3>
        <p>عدد المحاولات: {totalSpins}</p>
        <p>عدد الجوائز السابقة: {totalPrizes}</p>
      </div>

      <button className="save-btn" onClick={() => navigate("/wheel")}>
        العودة إلى الدولاب
      </button>
    </div>
  );
}