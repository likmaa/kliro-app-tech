const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const DEFAULT_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || null;

let accessToken: string | null = DEFAULT_TOKEN;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error((data as { detail?: string }).detail || 'Erreur API');
  }

  return data as T;
}

export type Mission = {
  id: number;
  client: number;
  vehicle: number;
  formula: 'essentiel' | 'premium';
  address: string;
  scheduled_at: string;
  status: 'pending' | 'assigned' | 'en_route' | 'on_site' | 'washing' | 'completed' | 'cancelled';
};

export function getBookings() {
  return request<Mission[]>('/bookings/');
}

export function getBooking(id: string | number) {
  return request<Mission>(`/bookings/${id}/`);
}

export function updateBookingStatus(id: string | number, status: Mission['status']) {
  return request<Mission>(`/bookings/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export function sendTechnicianLocation(payload: { booking_id?: number; lat: number; lng: number }) {
  return request('/tracking/location', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

