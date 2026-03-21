import { useState , useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../api/auth";
//import { ProfileContext } from "../context/profileContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const{isLoading , logout } =useContext(AuthContext)
  // const{userData  } =useContext(ProfileContext)
    const [user, setUser] = useState("");

  // const users = JSON.parse(localStorage.getItem("users")) || [];
  // const currentEmail = localStorage.getItem("currentUser");
  // const currentUser = users.find((u) => u.email === currentEmail);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data= await getProfile()
      console.log(data)
      setUser(data.user.name)
    }
    
    catch (error) {
      console.log(error);}
    }
    fetchProfile();
    },[])
 

  return (
    <div style={styles.container}>
      <div style={styles.right}>
        <span style={styles.hello}>
          Hello, {user}
        </span>

        <div style={styles.hamburgerWrapper}>
          <div style={styles.hamburger} onClick={() => setOpen(!open)}>
            ☰
          </div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.item} onClick={() => navigate("/profile")}>
                الملف الشخصي
              </div>
              <button
                style={{ width:'100%', backgroundColor: "red", color:'white',  padding: "12px",border:'none',
    cursor: "pointer",
    borderRadius:'5px'  }}
                onClick={logout}
              >
              {isLoading ? "...جاري تسجيل الخروج" : "تسجيل خروج"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "10px 20px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-end",
    position: "relative",
    background: "#0f0f0f",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  hello: {
    color: "#fff",
    fontSize: "16px",
  },
  hamburgerWrapper: {
    position: "relative",
  },
  hamburger: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: "35px",
    right: 0,
    background: "#1e1e1e",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    width: "160px",
    zIndex: 100,
    overflow: "hidden",
  },
  item: {
    padding: "12px",
    cursor: "pointer",
    borderBottom: "1px solid #333",
  },
};