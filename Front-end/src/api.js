// ==========================
// Safe JSON parsing helper
// ==========================
async function parseJsonSafe(res) {
           try {
                      return await res.json();
           } catch {
                      return null;
           }
}

// ==========================
// BACKEND BASE URL
// Point to the backend server running on port 5000
// ==========================
const API_BASE = "https://thinksecure.onrender.com";
// Backend server URL (use http://localhost:5000 for local dev, https://thinksecure.onrender.com for production)

// Export name expected by components (keeps compatibility)
export const API_URL = API_BASE;

// ==========================
// Core fetch wrapper
// ==========================
async function apiFetch(path, options = {}) {
           // sanitize path and build URL
           const cleanedPath = String(path || "").replace(/\uFEFF/g, "").trim();
           // avoid accidental spaces in scheme like "http:// localhost"
           const url = (API_BASE + cleanedPath).replace(/(https?:)\s+\//i, "$1//");

           let res;
           try {
                      res = await fetch(url, options);
           } catch (err) {
                      throw new Error(
                                 `Network error: could not reach API at ${url} (${err.message})`
                      );
           }

           const data = await parseJsonSafe(res);

           if (!res.ok) {
                      const msg =
                                 data && data.message
                                            ? data.message
                                            : `Request failed with status ${res.status}`;
                      throw new Error(msg);
           }

           return data;
}

// ==========================
// POST requests
// ==========================
export async function apiPost(path, body) {
           return apiFetch(path, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(body),
           });
}

// ==========================
// GET requests
// ==========================
export async function apiGet(path, token) {
           const headers = token ? { Authorization: `Bearer ${token}` } : {};
           return apiFetch(path, { headers });
}

// ==========================
// Challenge submission
// ==========================
export async function submitChallenge(challengeId, category, difficulty, isCorrect) {
           const token = localStorage.getItem("token");
           if (!token) {
                      throw new Error("You must be logged in to submit challenges");
           }

           return apiFetch("/api/challenges/submit", {
                      method: "POST",
                      headers: {
                                 "Content-Type": "application/json",
                                 Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ challengeId, category, difficulty, isCorrect }),
           });
}

// ==========================
// Get user progress
// ==========================
export async function getUserProgress() {
           const token = localStorage.getItem("token");
           if (!token) {
                      throw new Error("You must be logged in to view progress");
           }

           return apiFetch("/api/challenges/progress", {
                      headers: { Authorization: `Bearer ${token}` },
           });
}
