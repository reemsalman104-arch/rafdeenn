
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "../foldcss/wheel.css";

// Responsive, modular Wheel of Fortune with fixed center logo and pointer
export default function WheelOfFortune({ items = [], logo, size = 400 }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [selected, setSelected] = useState(null);

  // Redraw wheel on items or size change
  useEffect(() => {
    drawWheel();
    // eslint-disable-next-line
  }, [items, size]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = (size * dpr) | 0;
    const h = (size * dpr) | 0;
    canvas.width = w;
    canvas.height = h;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.scale(dpr, dpr);

    const radius = size / 2;
    const wedgeCount = items.length;
    if (!wedgeCount) return;
    const arc = (2 * Math.PI) / wedgeCount;
    const colors = items.map((_, i) => (i % 2 === 0 ? "#111" : "#22c55e"));

    ctx.clearRect(0, 0, size, size);

    items.forEach((item, i) => {
      const start = i * arc;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      // Draw text along arc
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = `${Math.max(12, size * 0.045)}px Cairo, Arial, sans-serif`;
      ctx.fillText(item, radius - 18, 0);
      ctx.restore();
    });
  };

  const spin = () => {
    if (spinning || !items.length) return;
    const wedgeCount = items.length;
    const arcDeg = 360 / wedgeCount;
    const randomIndex = Math.floor(Math.random() * wedgeCount);
    const randomOffset = Math.random() * arcDeg;
    const extraSpins = 5;
    const finalAngle = extraSpins * 360 + randomIndex * arcDeg + randomOffset;
    setSpinning(true);
    setAngle(finalAngle);
  };

  const handleTransitionEnd = () => {
    const wedgeCount = items.length;
    if (!wedgeCount) return;
    const arcDeg = 360 / wedgeCount;
    let normalized = angle % 360;
    normalized = (360 - normalized + arcDeg / 2) % 360;
    const index = Math.floor(normalized / arcDeg) % wedgeCount;
    setSelected(items[index]);
    setSpinning(false);
  };

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        {/* Wheel Canvas */}
        <canvas
          ref={canvasRef}
          className="wheel-canvas"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: spinning
              ? "transform 5s cubic-bezier(0.33,1,0.68,1)"
              : "none",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "transparent",
            overflow: "visible",
          }}
          onTransitionEnd={handleTransitionEnd}
        />

        {/* Pointer visually points to center logo */}
        <div className="custom-pointer" aria-label="pointer" />

        {/* Center logo, fixed while wheel spins */}
        <div className="center-logo">
          {logo && (
            <img
              src={logo}
              alt="logo"
              draggable={false}
              style={{ borderRadius: "50%", width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      </div>

      <button className="spin-button" onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {selected && (
        <div className="popup">
          <div className="popup-box">
            <h3>🎉 You got:</h3>
            <p>{selected}</p>
            <button
              className="close-btn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

WheelOfFortune.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  logo: PropTypes.string,
  size: PropTypes.number,
};
