import { useState, useEffect } from "react";
import {
  adminGetUsers,
  adminDeleteUser,
  adminGetWheelSections,
  adminCreateWheelSection,
  adminDeleteWheelSection,
  adminGetUserDetails,
  updateSpinStatus,
} from "../api/api";

// notification libraries
import Swal from "sweetalert";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  // ================= USERS =================
  const [users, setUsers] = useState([]);
  const [selectedUserSpins, setSelectedUserSpins] = useState([]);
  const [showSpinsModal, setShowSpinsModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await adminGetUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    const confirm = await Swal({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف هذا المستخدم نهائياً.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!confirm) return;

    try {
      await adminDeleteUser(id);
      setUsers((u) => u.filter((x) => x.id !== id));
      toastr.success("تم حذف المستخدم");
    } catch (e) {
      console.error(e);
      toastr.error("فشل حذف المستخدم");
    }
  };

  const handleViewUserSpins = async (userId, userName) => {
    try {
      const data = await adminGetUserDetails(userId);
      setSelectedUserSpins(data.spins || []);
      setSelectedUserName(userName);
      setShowSpinsModal(true);
    } catch (e) {
      console.error(e);
      toastr.error("فشل تحميل الجوائز");
    }
  };

  const handleUpdateSpinStatus = async (spinId, newStatus) => {
    try {
      await updateSpinStatus(spinId, newStatus);
      setSelectedUserSpins((spins) =>
        spins.map((s) => (s.id === spinId ? { ...s, status: newStatus } : s))
      );
      toastr.success("تم تحديث حالة الجائزة");
    } catch (e) {
      console.error(e);
      toastr.error("فشل تحديث حالة الجائزة");
    }
  };

  // ================= WHEEL =================
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionValue, setNewSectionValue] = useState("");

  const fetchSections = async () => {
    try {
      const data = await adminGetWheelSections();
      setSections(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "wheel") fetchSections();
  }, [activeTab]);

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !newSectionValue.trim()) {
      toastr.warning("يرجى إدخال اسم وقيمة الجائزة");
      return;
    }
    try {
      const payload = {
        title: newSectionName,
        prize_name: newSectionName,
        value: newSectionValue,
      };
      const section = await adminCreateWheelSection(payload);
      setSections((s) => [...s, section]);
      setNewSectionName("");
      setNewSectionValue("");
      toastr.success("تم إضافة الجائزة بنجاح");
    } catch (e) {
      console.error(e);
      toastr.error("فشل إضافة الجائزة");
    }
  };

  const handleDeleteSection = async (id) => {
    const confirmed = await Swal({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف هذه الجائزة ولن يمكن استعادتها.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!confirmed) return;

    try {
      await adminDeleteWheelSection(id);
      setSections((s) => s.filter((x) => x.id !== id));
      toastr.success("تم حذف الجائزة");
    } catch (e) {
      console.error(e);
      toastr.error("فشل حذف الجائزة");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={{ textAlign: "center", color: "#22c55e", marginBottom: 30 }}>لوحة التحكم</h3>
        <button
          style={activeTab === "users" ? styles.activeBtn : styles.sideBtn}
          onClick={() => setActiveTab("users")}
        >
          بيانات المستخدمين
        </button>
        <button
          style={activeTab === "wheel" ? styles.activeBtn : styles.sideBtn}
          onClick={() => setActiveTab("wheel")}
        >
          تعديل بيانات الدولاب
        </button>
        <button
          style={{ ...styles.sideBtn, background: "#22c55e", color: "#fff", marginTop: 20 }}
          onClick={() => window.location.href = "/wheel"}
        >
          العودة إلى الموقع
        </button>
        <button
          style={{ ...styles.sideBtn, background: "#dc2626", color: "#fff", marginTop: 20 }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          تسجيل خروج
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <>
            <h2 style={{ color: "#22c55e", marginBottom: 24 }}>إدارة المستخدمين</h2>
            <div style={{ display: "grid", gap: 24 }}>
              {users.map((user) => (
                <div key={user.id} style={styles.card}>
                  <div><b style={{ color: "#22c55e" }}>الاسم:</b> {user.name}</div>
                  <div><b style={{ color: "#22c55e" }}>الإيميل:</b> {user.email}</div>
                  <div><b style={{ color: "#22c55e" }}>الرقم:</b> {user.phone}</div>
                  <div><b style={{ color: "#22c55e" }}>عدد الجوائز:</b> {user.prizes_count}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{ ...styles.deleteBtn, background: "#007bff" }}
                      onClick={() => handleViewUserSpins(user.id, user.name)}
                    >
                      عرض الجوائز
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteUser(user.id)}>
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Spins Modal */}
        {showSpinsModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>جوائز المستخدم: {selectedUserName}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {selectedUserSpins.map((spin) => (
                  <div key={spin.id} style={styles.spinItem}>
                    <span>
                      {spin.wheel_section?.title || spin.wheel_section?.prize_name || ""}
                      - {new Date(spin.created_at).toLocaleString()}
                      - حالة: {spin.status === "won" ? "لم يتم التسليم" : spin.status}
                    </span>
                    {spin.status !== "delivered" && (
                      <button
                        style={styles.updateBtn}
                        onClick={() => handleUpdateSpinStatus(spin.id, "delivered")}
                      >
                        تم التسليم
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button style={styles.closeBtn} onClick={() => setShowSpinsModal(false)}>
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* ================= WHEEL ================= */}
        {activeTab === "wheel" && (
          <>
            <h2 style={{ color: "#22c55e", marginBottom: 24 }}>تعديل بيانات الدولاب</h2>
            <div style={{ ...styles.addSectionBox, marginBottom: 24 }}>
              <input
                style={styles.input}
                placeholder="اسم الجائزة"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 120 }}
                type="text"
                placeholder="قيمة الجائزة"
                value={newSectionValue}
                onChange={(e) => setNewSectionValue(e.target.value)}
              />
              <button style={styles.addBtn} onClick={handleAddSection}>
                إضافة
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sections.map((sec) => {
                const displayName = sec.title || sec.prize_name || "";
                const displayValue = sec.value ?? sec.prize_value ?? sec.amount ?? "";
                return (
                  <div key={sec.id} style={styles.sectionItem}>
                    <span>
                      {displayName}{displayValue ? ` – ${displayValue}` : ""}
                    </span>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteSection(sec.id)}>
                      حذف
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#fff",
    flexDirection: "row",
  },

  sidebar: {
    width: "250px",
    background: "#111",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRight: "2px solid #22c55e",
  },

  sideBtn: {
    padding: "10px",
    border: "none",
    background: "#1e1e1e",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  activeBtn: {
    padding: "10px",
    border: "none",
    background: "#22c55e",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    padding: "40px",
    overflowX: "auto",
  },

  card: {
    background: "#1e1e1e",
    borderRadius: 12,
    boxShadow: "0 2px 12px #0007",
    padding: 24,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #22c55e",
    gap: 16,
    minWidth: 300,
  },

  deleteBtn: { padding: "6px 10px", background: "#dc2626", border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer" },

  addSectionBox: { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#1e1e1e", color: "#fff", flex: 1, minWidth: "150px" },
  addBtn: { padding: "8px 15px", border: "none", background: "#22c55e", color: "#fff", borderRadius: "6px", cursor: "pointer" },
  sectionItem: { background: "#1e1e1e", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", border: "1px solid #333", flexWrap: "wrap" },

  updateBtn: {
    padding: "8px 12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeBtn: {
    padding: "10px 20px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: 20,
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#1e1e1e",
    color: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "80%",
    overflowY: "auto",
  },
  spinItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#333",
    borderRadius: "4px",
  },

  // ================= MEDIA QUERIES =================
  "@media (max-width: 768px)": {
    container: { flexDirection: "column" },
    sidebar: { width: "100%", borderRight: "none", borderBottom: "2px solid #22c55e", padding: "20px" },
    content: { padding: "20px", overflowX: "auto" },
    addSectionBox: { flexDirection: "column", gap: "10px" },
  },
};