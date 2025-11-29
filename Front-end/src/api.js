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
// Use relative paths so the frontend (ASP.NET dev server) can proxy `/api/*` to Node.
// Leave empty to call relative URLs like `/api/auth/login`.
// ==========================
const API_BASE = ""; // was "http://localhost:5000"

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
