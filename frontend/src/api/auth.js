import api from "./api";

export async function signup(email, password) {
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
}

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export function saveToken(token) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
}