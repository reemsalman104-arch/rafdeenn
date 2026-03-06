import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wheel } from "react-custom-roulette";
import logo from "../assets/logo.png"; // ضع شعارك هنا
import '../foldcss/wheel.css'
export default function Wheell() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "User";

  const [sections] = useState([
    "خصم 10%",
    "خصم 20%",
    "هدية مجانية",
    "خصم 30%",
    "خصم 50%",
    "هدية مفاجئة",
  ]);

  const items = sections.map((s) => ({ option: s }));

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);

  const handleSpin = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSelectedPrize(items[prizeNumber]?.option);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="wheel-container">
      {/* Header */}
      <div className="wheel-header">
        <span>مرحبا, {currentUser}</span>
        <button onClick={handleLogout} className="logout-btn">تسجيل خروج</button>
      </div>

      {/* Wheel */}
      <div className="wheel-wrapper">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={items}
          backgroundColors={["#111", "#22c55e", "#1e1e1e", "#16a34a", "#0f0f0f", "#15803d"]}
          textColors={["#fff"]}
          outerBorderColor="#22c55e"
          outerBorderWidth={6}
          radiusLineColor="#22c55e"
          radiusLineWidth={2}
          pointerProps={{ style: { display: "none" } }}
          onStopSpinning={handleStopSpinning}
        />

        {/* Custom pointer */}
        <div className="custom-pointer"></div>

        {/* Center logo */}
        <div className="center-logo">
          <img src={logo} alt="logo" />
        </div>
      </div>

      {/* Spin Button */}
      <button className="spin-button" onClick={handleSpin} disabled={mustSpin}>
        {mustSpin ? "جاري الدوران..." : "لف الآن"}
      </button>

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
     