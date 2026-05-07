const AUTH_PATH = "/api/controllers/auth";

async function request(body) {
  const response = await fetch(AUTH_PATH, {
    method: body ? "POST" : "GET",
    credentials: "include",
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Auth request failed");
  return data;
}

export const authService = {
  login(credentials) {
    return request({ ...credentials, action: "login" });
  },

  registerTeacher(payload) {
    return request({ ...payload, action: "register" });
  },

  verifyOtp(payload) {
    return request({ ...payload, action: "verify-otp" });
  },

  me() {
    return request();
  },
};
