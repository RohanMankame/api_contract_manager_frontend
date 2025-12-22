// src/services/auth.js
import api from './connect';
import API_PATHS from './apiPaths';

export async function login(username, password) {
  const response = await api.post(API_PATHS.login, { username, password });
  
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
}


export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}