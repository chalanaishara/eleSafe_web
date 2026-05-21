// src/services/api.js
export const BASE_URL = "http://localhost:8080";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken       = () => localStorage.getItem("accessToken");
export const getRefreshToken= () => localStorage.getItem("refreshToken");
export const getUser        = () => { try { return JSON.parse(localStorage.getItem("authUser") || "null"); } catch { return null; } };

export const saveSession = (data) => {
  localStorage.setItem("accessToken",  data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("authUser",     JSON.stringify(data));
};

export const clearSession = () => {
  ["accessToken","refreshToken","authUser"].forEach(k => localStorage.removeItem(k));
};

// ── Core authenticated fetch (auto-refreshes token on 401) ────────────────────
export async function authFetch(url, options = {}) {
  const makeHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  });

  let res = await fetch(`${BASE_URL}${url}`, { ...options, headers: makeHeaders(getToken()) });

  if (res.status === 401) {
    const rt = getRefreshToken();
    if (rt) {
      const rr = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (rr.ok) {
        const d = await rr.json();
        saveSession(d);
        res = await fetch(`${BASE_URL}${url}`, { ...options, headers: makeHeaders(d.accessToken) });
      } else {
        clearSession();
        window.location.href = "/";
        return null;
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }
  return res.json(); // AuthResponse
};

export const register = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed");
  }
  return res.json();
};

// ── Users (ADMIN only) ────────────────────────────────────────────────────────
export const getAllUsers     = ()               => authFetch("/api/users/getAllUsers");
export const getAllOfficers  = ()               => authFetch("/api/users/getAllWildOfficers");
export const getMyProfile   = ()               => authFetch("/api/users/getMyProfile");
export const updateUserStatus = (userId, status) =>
  authFetch(`/api/users/${userId}/status?status=${status}`, { method: "PATCH" });

// ── Reports ───────────────────────────────────────────────────────────────────
export const getRecentReports       = ()         => authFetch("/api/reports/recent");
export const getReportById          = (id)       => authFetch(`/api/reports/${id}`);
export const getReportsByVillage    = (village)  => authFetch(`/api/reports/village/${village}`);

// ✅ Officer's own duty-district reports (district derived from profile server-side)
export const getReportsByOfficerDistrict = () => authFetch("/api/reports/district");

// ✅ Specific district — officer must match; admin can use any
export const getReportsByDistrict   = (district) => authFetch(`/api/reports/district/${encodeURIComponent(district)}`);

export const updateDamageStatus     = (id, status) =>
  authFetch(`/api/reports/damage/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
