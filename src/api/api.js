const BASE_URL = process.env.REACT_APP_API_URL || "https://goget-ef.website/wheel/public";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const contentType = res.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    // backend errors usually come as {message: ..., errors: {...}}
    throw data;
  }
  return data;
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

   // ---------- WHEEL ----------
export const spinWheelRequest = (wheel_section_id) => {
  return request("/api/spin", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ wheel_section_id }),
  });
};

export const getWheelSections = () => {
  return request("/api/wheel-sections", {
    method: "GET",
  });
};

// 🔹 Spin
export const spinWheel = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * 8);
      resolve({ index: randomIndex });
    }, 1000);
  });
};


// ---------- ADMIN ----------
export const adminGetUsers = () => {
  return request("/api/admin/users", {
    method: "GET",
    headers: { ...authHeaders() },
  });
};

export const adminDeleteUser = (id) => {
  return request(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
};

export const adminGetWheelSections = () => {
  return request("/api/admin/wheel-sections", {
    method: "GET",
    headers: { ...authHeaders() },
  });
};

export const adminCreateWheelSection = (data) => {
  return request("/api/admin/wheel-sections", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
};

export const adminUpdateWheelSection = (id, data) => {
  return request(`/api/admin/wheel-sections/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
};

export const adminDeleteWheelSection = (id) => {
  return request(`/api/admin/wheel-sections/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
};

export const adminStats = () => {
  return request("/api/admin/stats", {
    method: "GET",
    headers: { ...authHeaders() },
  });
};

export const adminGetUserDetails = (userId) => {
  return request(`/api/admin/users/${userId}`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
};

export const updateSpinStatus = (spinId, status) => {
  return request(`/api/admin/spins/${spinId}/status`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

// ---------- ADVERTISEMENTS ----------
export const getAdvertisements = () => {
  return request("/api/advertisements", {
    method: "GET",
  });
};

export const adminGetAdvertisements = () => {
  return request("/api/admin/advertisements", {
    method: "GET",
    headers: { ...authHeaders() },
  });
};

export const adminUpdateAdvertisement = (id, videoFile) => {
  const formData = new FormData();
  formData.append("video", videoFile);
  
  return request(`/api/admin/advertisements/${id}`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "X-HTTP-Method-Override": "PUT",
    },
    body: formData,
  });
};
