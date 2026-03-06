import { useState } from "react";
import "../foldcss/profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("edit");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="profile-container">
      
      {/* زر يظهر فقط على الموبايل */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰ القائمة
      </button>

      {/* Sidebar */}
      <div className={`profile-sidebar ${menuOpen ? "show" : ""}`}>
        <h3 className="sidebar-title">حسابي</h3>

        <button
          className={activeTab === "edit" ? "active-btn" : "side-btn"}
          onClick={() => {
            setActiveTab("edit");
            setMenuOpen(false);
          }}
        >
          تعديل البيانات
        </button>

        <button
          className={activeTab === "prizes" ? "active-btn" : "side-btn"}
          onClick={() => {
            setActiveTab("prizes");
            setMenuOpen(false);
          }}
        >
          الجوائز السابقة
        </button>

        <button
          className={activeTab === "password" ? "active-btn" : "side-btn"}
          onClick={() => {
            setActiveTab("password");
            setMenuOpen(false);
          }}
        >
          تغيير كلمة السر
        </button>

        <button
          className={activeTab === "delete" ? "delete-active" : "delete-btn"}
          onClick={() => {
            setActiveTab("delete");
            setMenuOpen(false);
          }}
        >
          حذف الحساب
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">

        {activeTab === "edit" && (
          <div>
            <h2>تعديل البيانات</h2>
            <input className="profile-input" placeholder="الاسم" />
            <input className="profile-input" placeholder="رقم الهاتف" />
            <input className="profile-input" placeholder="البريد الإلكتروني" />
            <button className="save-btn">حفظ التعديلات</button>
          </div>
        )}

        {activeTab === "prizes" && (
          <div>
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
                <tr>
                  <td>خصم 20%</td>
                  <td>2026-03-01</td>
                  <td>تم الاستلام</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "password" && (
          <div>
            <h2>تغيير كلمة السر</h2>
            <input className="profile-input" type="password" placeholder="كلمة السر الحالية" />
            <input className="profile-input" type="password" placeholder="كلمة السر الجديدة" />
            <input className="profile-input" type="password" placeholder="تأكيد كلمة السر الجديدة" />
            <button className="save-btn">تغيير كلمة السر</button>
          </div>
        )}

        {activeTab === "delete" && (
          <div>
            <h2 className="delete-title">حذف الحساب</h2>
            <p>هذا الإجراء لا يمكن التراجع عنه.</p>
            <button className="delete-btn">حذف حسابي نهائياً</button>
          </div>
        )}

      </div>
    </div>
  );
}