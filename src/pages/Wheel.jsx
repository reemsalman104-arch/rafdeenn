
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Wheel } from "react-custom-roulette";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import { getWheelSections, spinWheelRequest } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import '../foldcss/wheel.css';


export default function Wheell() {
    const { logout } = useContext(AuthContext);

  // const navigate = useNavigate();
  // const username = localStorage.getItem("currentUserName") || "User";
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    setShowAd(true);
    async function loadSections() {
      try {
        const data = await getWheelSections();
        if (Array.isArray(data)) {
          setSections(data);
          setItems(
            data.map((s) => ({ option: s.title || s.prize_name || "" })),
          );
        } else {
          console.error("Invalid sections data:", data);
        }
      } catch (e) {
        console.error("failed to fetch sections", e);
      }
    }
    loadSections();
  }, []);
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const targetIndexRef = useRef(null); // keep track of computed index across renders
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [message, setMessage] = useState("");

  const handleSpin = async () => {
    if (items.length === 0) {
      setMessage("لا توجد أقسام متاحة حاليًا");
      return;
    }
    setMessage("");

    try {
      const randomIndex = Math.floor(Math.random() * sections.length);
      const selectedSection = sections[randomIndex];
      const wheel_section_id = selectedSection.id;

      const res = await spinWheelRequest(wheel_section_id);
      if (res.error) {
        setMessage(res.error);
        return;
      }

      let index = res.index !== undefined ? res.index : randomIndex;

      console.log("server index", res.index, "randomIndex", randomIndex);

      // تعديل المصفوفة إذا احتجنا لعكس أو إزاحة القيمة حسب اتجاه العجلة
      // الخيار 1 - الأكثر احتمالاً (تدوير عكس عقارب الساعة وتبدأ من أعلى)
      index = (sections.length - index) % sections.length;

      // الخيار 2
      // index = (sections.length - index - 1) % sections.length;

      // الخيار 3
      // index = (index + 1) % sections.length;

      targetIndexRef.current = index;
      setPrizeNumber(index);
      setMustSpin(true);
      console.log(
        "computed target index",
        index,
        "option",
        items[index]?.option,
      );
    } catch (e) {
      console.error(e);
      setMessage(e.message || "حدث خطأ أثناء الدوران");
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    const finalIndex =
      targetIndexRef.current != null ? targetIndexRef.current : prizeNumber;
    const prize = items[finalIndex]?.option;
    setSelectedPrize(prize);
    console.log(
      "wheel stopped, prize at pointer:",
      prize,
      "(index",
      finalIndex,
      ")",
    );
  };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/login");
  // };

  useEffect(() => {
    setShowAd(true);
  }, []);

  return (
    <div className="wheel-container">
      {showAd && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={() => setShowAd(false)}>
              ✕
            </button>

            <video autoPlay controls className="modal-video">
              <source src="/video/ad.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* Top-right nav area */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <Navbar />
      </div>

      {/* Wheel */}
       {/* Wheel */}
      <div className="wheel-wrapper">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={items.length > 0 ? items : [{ option: "Loading..." }]}
          backgroundColors={["#111", "#22c55e", "#1e1e1e", "#16a34a", "#0f0f0f", "#15803d"]}
          textColors={["#fff"]}
          outerBorderColor="#22c55e"
          outerBorderWidth={6}
          radiusLineColor="#22c55e"
          radiusLineWidth={2}
          // show library's own pointer so it lines up with the internal
          // rotation math (initialRotation constant is 43deg).  we were
          // hiding it earlier and drawing our own triangle, which looked
          // centered but actually sat in the wrong spot relative to the
          // calculated stopping angle.  removing the hide fixes the off‑by‑one
          // appearance.
          //
          // you can still customise the image via pointerProps if needed:
          // pointerProps={{ src: '/path/to/custom.png', style: { width: '20%' } }}
          onStopSpinning={handleStopSpinning}
        />


        {/* Center logo */}
        <div className="center-logo">
          <img src={logo} alt="logo" />
        </div>
      </div>

      {/* Spin Button */}
      <button className="spin-button" onClick={handleSpin} disabled={mustSpin}>
        {mustSpin ? "جاري الدوران..." : "لف الآن"}
      </button>

      {message && <div className="error" style={{ marginTop: 10 }}>{message}</div>}


      {/* Popup */}
       {selectedPrize && (
        <div className="popup">
          <div className="popup-box">
            <h3>🎉 مبروك!</h3>
            <p>فزت بـ: {selectedPrize}</p>
            <button className="close-btn" onClick={() => setSelectedPrize(null)}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
