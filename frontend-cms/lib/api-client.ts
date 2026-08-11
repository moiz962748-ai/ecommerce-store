const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message || 'Kuch ghalat ho gaya');
  }

  return data;
}