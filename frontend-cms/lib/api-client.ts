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

  // Try to parse JSON; if it fails, fall back to text
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    try {
      data = await res.text();
    } catch (e2) {
      data = null;
    }
  }

  if (!res.ok) {
    // Prefer structured messages when available
    let message: string | undefined;
    if (data) {
      if (typeof data === 'string') {
        message = data;
      } else if (data.message) {
        message = Array.isArray(data.message) ? data.message[0] : data.message;
      } else if (data.error) {
        message = data.error;
      } else {
        message = JSON.stringify(data);
      }
    }

    throw new Error(message || res.statusText || 'Something went wrong');
  }

  return data;
}