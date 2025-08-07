const API_BASE = "/api"; // Change this to real backend address as needed

function getToken() {
  return localStorage.getItem("jwt") || "";
}
function setToken(token: string) {
  if (token) localStorage.setItem("jwt", token);
  else localStorage.removeItem("jwt");
}
// PUBLIC_INTERFACE
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) {
    const data = await res.json();
    setToken(data.token);
    return data.user;
  }
  throw new Error("Login failed");
}
// PUBLIC_INTERFACE
export async function apiRegister(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) {
    const data = await res.json();
    setToken(data.token);
    return data.user;
  }
  throw new Error("Register failed");
}
// PUBLIC_INTERFACE
export async function apiLogout() {
  setToken("");
}
// PUBLIC_INTERFACE
export async function apiGetMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    return await res.json();
  }
  setToken("");
  return null;
}
// PUBLIC_INTERFACE
export async function apiGetNotes() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  return await res.json();
}
// PUBLIC_INTERFACE
export async function apiCreateNote(note) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Failed to create note");
  return await res.json();
}
// PUBLIC_INTERFACE
export async function apiUpdateNote(note) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/notes/${note.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Failed to update note");
  return await res.json();
}
// PUBLIC_INTERFACE
export async function apiDeleteNote(noteId) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return await res.json();
}
// PUBLIC_INTERFACE
export async function apiGetTags() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/tags`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  return await res.json();
}
// PUBLIC_INTERFACE
export async function apiCreateTag(tagName: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: tagName }),
  });
  if (!res.ok) throw new Error("Failed to create tag");
  return await res.json();
}
