//  API client

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(method, url, body = null) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${BASE_URL}${url}`;
  console.log('Request:', method, fullUrl, body);

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  console.log('Response:', response.status, data);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
    }
    
    const error = new Error(data?.message || response.statusText || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  // Always return the nested data property
  return data.data;
}

const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  delete: (url) => request('DELETE', url),
};

export default api;