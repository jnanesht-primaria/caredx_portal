// frontend/src/api/receptionist.js
import { authHeader } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    ...authHeader(),
  };
}

export async function fetchDashboardStats(date) {
  const res = await fetch(`${API_URL}/api/receptionist/stats?date=${date}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function fetchAppointments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/receptionist/appointments?${query}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function updateAppointmentStatus(appointmentId, status) {
  const res = await fetch(`${API_URL}/api/receptionist/appointments/${appointmentId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function registerPatient(patientData) {
  const res = await fetch(`${API_URL}/api/receptionist/patients`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function searchPatients(query) {
  const res = await fetch(
    `${API_URL}/api/receptionist/patients/search?q=${encodeURIComponent(query)}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw res;
  return res.json();
}

export async function bookAppointment(appointmentData) {
  const res = await fetch(`${API_URL}/api/receptionist/appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  });
  if (!res.ok) throw res;
  return res.json();
}