import { useState, useEffect, useRef } from "react";
import {
  adminGetUsers,
  adminDeleteUser,
  adminGetWheelSections,
  adminCreateWheelSection,
  adminDeleteWheelSection,
  adminGetUserDetails,
  updateSpinStatus,
  adminGetAdvertisements,
  adminUpdateAdvertisement,
} from "../api/api";

// notification libraries
import Swal from "sweetalert";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "../foldcss/dashboard-responsive.css";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================= USERS =================
  const [users, setUsers] = useState([]);
  const [selectedUserSpins, setSelectedUserSpins] = useState([]);
  const [showSpinsModal, setShowSpinsModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");

  // ================= ADVERTISEMENTS =================
  const [advertisements, setAdvertisements] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const videoInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const fetchUsers = async () => {
    try {
      const data = await adminGetUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

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
    if (activeTab === "advertisements") fetchAdvertisements();
  }, [activeTab]);

  // ================= ADVERTISEMENTS =================
  const fetchAdvertisements = async () => {
    try {
      const data = await adminGetAdvertisements();
      setAdvertisements(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toastr.error("فشل تحميل الإعلانات");
    }
  };

  const handleUpdateAdvertisement = async (adId) => {
    if (!editingFile) {
      toastr.warning("يرجى اختيار فيديو للتحديث");
      return;
    }

    try {
      await adminUpdateAdvertisement(adId, editingFile);
      setEditingAdId(null);
      setEditingFile(null);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
      toastr.success("تم تحديث الإعلان بنجاح");
      fetchAdvertisements();
    } catch (e) {
      console.error(e);
      toastr.error("فشل تحديث الإعلان");
    }
  };

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
      {/* Hamburger Menu */}
      <div  style={{
    ...styles.hamburgerContainer,
    display: isMobile ? "flex" : "none",
  }}>
        <button
          style={styles.hamburgerBtn}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h3 style={styles.mobileTitle}>لوحة التحكم</h3>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
  <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
)}

      {/* Sidebar */}
      <div
        style={{
  ...styles.sidebar,
  position: isMobile ? "fixed" : "relative",
  top: isMobile ? "60px" : "0",
  left: isMobile ? (sidebarOpen ? "0" : "-250px") : "0",
  height: isMobile ? "calc(100vh - 60px)" : "auto",
  transition: "0.3s",
  zIndex: 1000,
}}
      >
        <button
          style={styles.closeBtn}
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <h3 style={{ textAlign: "center", color: "#22c55e", marginBottom: 30 }}>
          لوحة التحكم
        </h3>
        <button
          style={activeTab === "users" ? styles.activeBtn : styles.sideBtn}
          onClick={() => {
            setActiveTab("users");
            setSidebarOpen(false);
          }}
        >
          بيانات المستخدمين
        </button>
        <button
          style={activeTab === "wheel" ? styles.activeBtn : styles.sideBtn}
          onClick={() => {
            setActiveTab("wheel");
            setSidebarOpen(false);
          }}
        >
          تعديل بيانات الدولاب
        </button>
        <button
          style={activeTab === "advertisements" ? styles.activeBtn : styles.sideBtn}
          onClick={() => {
            setActiveTab("advertisements");
            setSidebarOpen(false);
          }}
        >
          إدارة الإعلانات
        </button>
        <button
          style={{ ...styles.sideBtn, background: "#22c55e", color: "#000", marginTop: 20 }}
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
            {users.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
                <p>لا توجد مستخدمون حالياً</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {users.map((user) => (
                  <div key={user.id} style={styles.card}>
                    <div><b style={{ color: "#22c55e" }}>الاسم:</b> {user.name}</div>
                    <div><b style={{ color: "#22c55e" }}>الإيميل:</b> {user.email}</div>
                    <div><b style={{ color: "#22c55e" }}>الرقم:</b> {user.phone}</div>
                    <div><b style={{ color: "#22c55e" }}>عدد الجوائز:</b> {user.prizes_count}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: "100%" }}>
                      <button
                        style={{ ...styles.deleteBtn, background: "#007bff", flex: 1, minWidth: "120px" }}
                        onClick={() => handleViewUserSpins(user.id, user.name)}
                      >
                        عرض الجوائز
                      </button>
                      <button
                        style={{ ...styles.deleteBtn, flex: 1, minWidth: "120px" }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Spins Modal */}
        {showSpinsModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{ color: "#22c55e", marginTop: 0 }}>جوائز المستخدم: {selectedUserName}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {selectedUserSpins.map((spin) => (
                  <div key={spin.id} style={styles.spinItem}>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {spin.wheel_section?.title || spin.wheel_section?.prize_name || ""} - {new Date(spin.created_at).toLocaleString()} - حالة: {spin.status === "won" ? "لم يتم التسليم" : spin.status}
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
              <button style={styles.closeModalBtn} onClick={() => setShowSpinsModal(false)}>
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* ================= WHEEL ================= */}
        {activeTab === "wheel" && (
          <>
            <h2 style={{ color: "#22c55e", marginBottom: 24 }}>تعديل بيانات الدولاب</h2>
            <div style={styles.addSectionBox}>
              <input
                style={styles.input}
                placeholder="اسم الجائزة"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <input
                style={{ ...styles.input, minWidth: "100px" }}
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
                    <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>
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

        {/* ================= ADVERTISEMENTS ================= */}
        {activeTab === "advertisements" && (
          <>
            <h2 style={{ color: "#22c55e", marginBottom: 24 }}>إدارة الإعلانات</h2>
            <div style={styles.adsGrid}>
              {advertisements.map((ad) => (
                <div key={ad.id} style={styles.adCard}>
                  <div style={{ marginBottom: 16 }}>
                    <p><b style={{ color: "#22c55e" }}>رقم الإعلان:</b> {ad.id}</p>
                    {ad.video_url && (
                      <video 
                        style={{ width: "100%", borderRadius: "8px", marginTop: 12, maxHeight: "250px" }}
                        controls
                      >
                        <source src={ad.video_url} type="video/quicktime" />
                        <source src={ad.video_url} type="video/mp4" />
                      </video>
                    )}
                  </div>
                  
                  {editingAdId === ad.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditingFile(e.target.files?.[0] || null)}
                        style={{ ...styles.input, padding: "10px" }}
                      />
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          style={{ ...styles.addBtn, flex: 1, minWidth: "120px" }}
                          onClick={() => handleUpdateAdvertisement(ad.id)}
                        >
                          حفظ التحديث
                        </button>
                        <button
                          style={{ ...styles.deleteBtn, flex: 1, minWidth: "120px" }}
                          onClick={() => {
                            setEditingAdId(null);
                            setEditingFile(null);
                            if (videoInputRef.current) {
                              videoInputRef.current.value = "";
                            }
                          }}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      style={{ ...styles.addBtn, width: "100%" }}
                      onClick={() => setEditingAdId(ad.id)}
                    >
                      تعديل الفيديو
                    </button>
                  )}
                </div>
              ))}
            </div>
            {advertisements.length === 0 && (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
                لا توجد إعلانات حالياً
              </div>
            )}
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

  hamburgerContainer: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    height: "60px",
    background: "#111",
    borderBottom: "2px solid #22c55e",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 15px",
    
  },

  hamburgerBtn: {
    fontSize: "28px",
    background: "none",
    border: "none",
    color: "#22c55e",
    cursor: "pointer",
    padding: "5px 10px",
  },

  mobileTitle: {
    margin: 0,
    color: "#22c55e",
    fontSize: "16px",
  },

  overlay: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 500,
    
  },

  sidebar: {
    width: "250px",
    background: "#111",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRight: "2px solid #22c55e",
    position: "relative",
  },

 

 

  closeBtn: {
    display: "none",
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: "#22c55e",
    fontSize: "24px",
    cursor: "pointer",
   
  },

  sideBtn: {
    padding: "12px",
    border: "none",
    background: "#1e1e1e",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  activeBtn: {
    padding: "12px",
    border: "none",
    background: "#22c55e",
    color: "#000",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },

  content: {
    flex: 1,
    padding: "40px",
    overflowX: "auto",
     marginTop: "20px",
     marginLeft: "10px"
  },

  card: {
    background: "#1e1e1e",
    borderRadius: 12,
    boxShadow: "0 2px 12px #0007",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    border: "1px solid #22c55e",
    gap: 16,
    marginBottom: 20,
   
  },

  deleteBtn: {
    padding: "8px 12px",
    background: "#dc2626",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    whiteSpace: "nowrap",
   
  },

  addSectionBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
    flexWrap: "wrap",
   
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#1e1e1e",
    color: "#fff",
    flex: 1,
    minWidth: "150px",
    fontSize: "14px",
   
  },

  addBtn: {
    padding: "10px 15px",
    border: "none",
    background: "#22c55e",
    color: "#000",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
   
  },

  sectionItem: {
    background: "#1e1e1e",
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    border: "1px solid #333",
    flexWrap: "wrap",
    gap: 10,
   
  },

  updateBtn: {
    padding: "8px 12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },

  closeModalBtn: {
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
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "20px",
  },

  modalContent: {
    background: "#1e1e1e",
    color: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid #22c55e",
   
  },

  spinItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#333",
    borderRadius: "4px",
    marginBottom: "8px",
    flexWrap: "wrap",
    gap: 8,
   
  },

  adCard: {
    background: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    border: "1px solid #22c55e",
    display: "flex",
    flexDirection: "column",
    gap: 12,
   
  },

  adsGrid: {
    display: "grid",
    gap: 24,
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    
  },
};