// src/services/auth.js
import api from './connect';
import API_PATHS from './apiPaths';

export async function login(email, password) {
  const response = await api.post(API_PATHS.login, { email, password });
  
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
}

export function logout() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}