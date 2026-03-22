import type { AuthResponse, AvailableSlotsResponse, BookingResponse, UpdateProfileInput, UpdatePasswordInput } from '@bookit/shared';

/**
 * API client for communicating with the BookIt NestJS backend.
 * Handles JWT token management and provides typed API methods.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Get the stored auth token from localStorage */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bookit_token');
}

/** Store the auth token in localStorage */
export function setToken(token: string): void {
  localStorage.setItem('bookit_token', token);
}

/** Remove the auth token from localStorage */
export function removeToken(): void {
  localStorage.removeItem('bookit_token');
}

/**
 * Base fetch wrapper with error handling and auth headers.
 * Automatically attaches JWT token to authenticated requests.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message || `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status, errorData);
  }

  return response.json();
}

/** Custom API error class with status code and response data */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// Auth API
// ============================================

/** Login with email and password */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(response.accessToken);
  return response;
}

/** Register a new user */
export async function register(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  setToken(response.accessToken);
  return response;
}

/** Update user profile */
export async function updateProfile(data: UpdateProfileInput): Promise<AuthResponse['user']> {
  return apiFetch<AuthResponse['user']>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Update user password */
export async function updatePassword(data: UpdatePasswordInput): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Upload user avatar */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/api/auth/avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Failed to upload avatar', response.status, errorData);
  }

  return response.json();
}

// ============================================
// Bookings API
// ============================================

/** Fetch available time slots for a specific date */
export async function getAvailableSlots(
  date: string,
): Promise<AvailableSlotsResponse> {
  return apiFetch<AvailableSlotsResponse>(
    `/bookings/available?date=${encodeURIComponent(date)}`,
  );
}

/** Fetch all bookings for the authenticated user */
export async function getMyBookings(): Promise<BookingResponse[]> {
  return apiFetch<BookingResponse[]>('/bookings');
}

/** Book a session at the specified time slot */
export async function bookSession(
  timeSlotId: string,
  date: string,
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>('/bookings', {
    method: 'POST',
    body: JSON.stringify({ timeSlotId, date }),
  });
}

/** Cancel a booking */
export async function cancelBooking(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/bookings/${id}`, {
    method: 'DELETE',
  });
}

/** Reschedule a booking */
export async function rescheduleBooking(
  id: string,
  timeSlotId: string,
  date: string,
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>(`/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ timeSlotId, date }),
  });
}

/** Create a new time slot */
export async function createTimeSlot(
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
): Promise<any> {
  return apiFetch<any>('/bookings/time-slots', {
    method: 'POST',
    body: JSON.stringify({ date, startTime, endTime, duration }),
  });
}

// ============================================
// Mentors API
// ============================================

/** Fetch all mentors for the user */
export async function getMentors(): Promise<any[]> {
  return apiFetch<any[]>('/mentors');
}

/** Create a new mentor */
export async function addMentor(data: { name: string; company: string; role: string; email: string }): Promise<any> {
  return apiFetch<any>('/mentors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
