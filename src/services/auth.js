// src/services/auth.js
import api from './connect';
import API_PATHS from './apiPaths';

export async function login(email, password) {
  const response = await api.post(API_PATHS.login, { email, password });

  if (response.token) {
    localStorage.setItem('token', response.token);

    // Save user's email (prefer response data, otherwise fallback to the login email)
    const userEmail = response?.user?.email || response?.email || email;
    localStorage.setItem('user', JSON.stringify({ email: userEmail }));
  }

  return response;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}