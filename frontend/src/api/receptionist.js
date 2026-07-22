// frontend/src/api/receptionist.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/receptionist";

// FIX: Use consistent token key - match what's used in auth.js
const getAuthHeader = () => {
  // Try both possible token keys for compatibility
  const token = localStorage.getItem("caredx_token") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function fetchDashboardStats(date) {
  try {
    const res = await axios.get(`${API_BASE}/stats?date=${date}`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

export async function fetchAppointments({ date, status, search }) {
  try {
    let url = `${API_BASE}/appointments?date=${date}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await axios.get(url, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function updateAppointmentStatus(appointmentId, status) {
  try {
    const res = await axios.patch(
      `${API_BASE}/appointments/${appointmentId}/status`,
      { status },
      getAuthHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
}

export async function registerPatient(patientData) {
  try {
    const res = await axios.post(`${API_BASE}/patients`, patientData, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error;
  }
}

export async function bookAppointment(appointmentData) {
  try {
    const res = await axios.post(`${API_BASE}/appointments`, appointmentData, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
}

export async function searchPatients(query = "") {
  try {
    const res = await axios.get(
      `${API_BASE}/patients/search?query=${encodeURIComponent(query)}`,
      getAuthHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Error searching patients:", error);
    throw error;
  }
}

// Add a helper to check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("caredx_token") || localStorage.getItem("token");
  return Boolean(token);
}