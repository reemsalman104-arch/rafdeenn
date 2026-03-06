import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  // ================= USERS =================
  const [users, setUsers] = useState([
    {
      name: "Ahmad",
      email: "ahmad@test.com",
      phone: "0599999999",
      prizes: 3,
      status: "نشط",
    },
    {
      name: "Sara",
      email: "sara@test.com",
      phone: "0588888888",
      prizes: 1,
      status: "موقوف",
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleEditUser = (index) => {
    setEditingIndex(index);
    setNewStatus(users[index].status);
  };

  const handleSaveUser = (index) => {
    const updated = [...users];
    updated[index].status = newStatus;
    setUsers(updated);
    setEditingIndex(null);
  };

  const handleDeleteUser = (index) => {
    const filtered = users.filter((_, i) => i !== index);
    setUsers(filtered);
  };

  // ================= WHEEL =================
  const [sections, setSections] = useState([
    "خصم 10%",
    "خصم 20%",
    "جائزة مجانية",
    "إعادة المحاولة",
  ]);

  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    setSections([...sections, newSectionName]);
    setNewSectionName("");
  };

  const handleDeleteSection = (index) => {
    const filtered = sections.filter((_, i) => i !== index);
    setSections(filtered);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={{ textAlign: "center" }}>لوحة التحكم</h3>

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
          style={activeTab === "wheel" ? styles.activeBtn : styles.sideBtn}>
          logout
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <>
            <h2>إدارة المستخدمين</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الإيميل</th>
                  <th>الرقم</th>
                  <th>عدد الجوائز</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.prizes}</td>

                    <td>
                      {editingIndex === index ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          style={styles.select}
                        >
                          <option value="نشط">نشط</option>
                          <option value="موقوف">موقوف</option>
                        </select>
                      ) : (
                        user.status
                      )}
                    </td>

                    <td>
                      {editingIndex === index ? (
                        <button
                          style={styles.saveBtn}
                          onClick={() => handleSaveUser(index)}
                        >
                          حفظ
                        </button>
                      ) : (
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEditUser(index)}
                        >
                          تعديل
                        </button>
                      )}

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteUser(index)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= WHEEL ================= */}
        {activeTab === "wheel" && (
          <>
            <h2>تعديل بيانات الدولاب</h2>

            <div style={styles.addSectionBox}>
              <input
                style={styles.input}
                placeholder="اسم السيكشن الجديد"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <button style={styles.addBtn} onClick={handleAddSection}>
                إضافة
              </button>
            </div>

            <div style={{ marginTop: "20px" }}>
              {sections.map((sec, index) => (
                <div key={index} style={styles.sectionItem}>
                  <span>{sec}</span>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteSection(index)}
                  >
                    حذف
                  </button>
                </div>
              ))}
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    tableLayout: "fixed",
  },

  th: {
    padding: "12px",
    textAlign: "center",
    background: "#111",
    color: "#22c55e",
    border: "1px solid #333",
  },

  td: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #333",
    color: "#fff",
    wordWrap: "break-word",
  },

  editBtn: { padding: "6px 10px", background: "#2563eb", border: "none", color: "#fff", borderRadius: "6px", marginRight: "5px", cursor: "pointer" },
  saveBtn: { padding: "6px 10px", background: "#22c55e", border: "none", color: "#fff", borderRadius: "6px", marginRight: "5px", cursor: "pointer" },
  deleteBtn: { padding: "6px 10px", background: "#dc2626", border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer" },

  select: { padding: "5px", borderRadius: "5px", border: "1px solid #333", background: "#1e1e1e", color: "#fff" },

  addSectionBox: { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#1e1e1e", color: "#fff", flex: 1, minWidth: "150px" },
  addBtn: { padding: "8px 15px", border: "none", background: "#22c55e", color: "#fff", borderRadius: "6px", cursor: "pointer" },
  sectionItem: { background: "#1e1e1e", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", border: "1px solid #333", flexWrap: "wrap" },

  // ================= MEDIA QUERIES =================
  "@media (max-width: 768px)": {
    container: { flexDirection: "column" },
    sidebar: { width: "100%", borderRight: "none", borderBottom: "2px solid #22c55e", padding: "20px" },
    content: { padding: "20px", overflowX: "auto" },
    addSectionBox: { flexDirection: "column", gap: "10px" },
  },
};