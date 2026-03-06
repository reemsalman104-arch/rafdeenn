import { createContext, useState, useEffect } from "react";

export const WheelContext = createContext();

export const WheelProvider = ({ children }) => {
  const [newSection, setNewSection] = useState(() => {
    const saved = localStorage.getItem("wheelSections");
    return saved
      ? JSON.parse(saved)
      : [newSection];
  });

  useEffect(() => {
    localStorage.setItem("wheelSections", JSON.stringify(newSection));
  }, [newSection]);

  return (
    <WheelContext.Provider value={{ newSection, setNewSection }}>
      {children}
    </WheelContext.Provider>
  );
};