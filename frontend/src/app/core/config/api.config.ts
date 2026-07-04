const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

const isLocalDevelopment =
  typeof window !== 'undefined' &&
  LOCAL_HOSTS.has(window.location.hostname);

export const API_BASE_URL = isLocalDevelopment
  ? 'http://127.0.0.1:8000/api/v1'
  : 'https://stockflow-i2et.onrender.com/api/v1';
