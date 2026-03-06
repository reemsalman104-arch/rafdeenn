// services/api.js

// 🔹 Login
export const loginRequest = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.phone === "0799999999" && data.password === "123456") {
        resolve({ token: "fake-token-123" });
      } else {
        reject("بيانات غير صحيحة");
      }
    }, 1000);
  });
};

// 🔹 Wheel Items (8 أقسام)

   

// 🔹 Spin
export const spinWheel = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * 8);
      resolve({ index: randomIndex });
    }, 1000);
  });
};