// frontend/src/pages/receptionist/Dashboard.jsx

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchAppointments, fetchDashboardStats, updateAppointmentStatus } from "../../api/receptionist";

// Updated paths to match your current folder name on disk
import StatCard from "../../components/recepetionist/StatCard";
import AppointmentsTable from "../../components/recepetionist/AppointmentsTable";
import PatientModal from "../../components/recepetionist/PatientModal";
import BookAppointmentModal from "../../components/recepetionist/BookAppointmentModal";
import "./Dashboard.css";

const STATUS_FILTERS = ["All", "Scheduled", "CheckedIn", "InProgress", "Completed", "Cancelled"];
const today = () => new Date().toISOString().slice(0, 10);

export default function ReceptionistDashboard() {
  const { user, logout } = useAuth();

  const [date, setDate] = useState(today());
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [justRegistered, setJustRegistered] = useState(null);
  const [toast, setToast] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, apptRes] = await Promise.all([
        fetchDashboardStats(date),
        fetchAppointments({
          date,
          status: statusFilter === "All" ? undefined : statusFilter,
          search: search || undefined,
        }),
      ]);
      setStats(statsRes);
      setAppointments(apptRes);
    } catch (err) {
      setError(err.data?.message || err.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [date, statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Light auto-refresh so the queue stays current during a shift
  useEffect(() => {
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleStatusChange(appointmentId, nextStatus) {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: nextStatus } : a))
    );
    try {
      await updateAppointmentStatus(appointmentId, nextStatus);
      showToast(`Marked as ${nextStatus}.`);
      loadData();
    } catch (err) {
      showToast("Could not update status — refreshing.");
      loadData();
    }
  }

  function handlePatientRegistered(patient) {
    setShowPatientModal(false);
    setJustRegistered(patient);
    setShowBookModal(true);
    showToast(`${patient.full_name} registered.`);
  }

  function handleAppointmentBooked() {
    setShowBookModal(false);
    setJustRegistered(null);
    showToast("Appointment booked.");
    loadData();
  }

  return (
    <div className="rcp-shell">
      <header className="rcp-header">
        <div>
          <p className="rcp-eyebrow">CareDx · Receptionist</p>
          <h1>Front Desk</h1>
        </div>
        <div className="rcp-header-right">
          <div className="rcp-user">
            <span className="rcp-user-name">{user?.name}</span>
            <span className="rcp-user-role">Receptionist</span>
          </div>
          <button className="btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {toast && <div className="rcp-toast">{toast}</div>}

      <section className="rcp-stats">
        <StatCard label="Today's appointments" value={stats?.total_today ?? "–"} />
        <StatCard label="Checked in" value={stats?.checked_in ?? "–"} tone="info" />
        <StatCard label="In progress" value={stats?.in_progress ?? "–"} tone="info" />
        <StatCard label="Completed" value={stats?.completed ?? "–"} tone="success" />
        <StatCard label="Urgent (open)" value={stats?.urgent_open ?? "–"} tone="urgent" />
        <StatCard label="New patients today" value={stats?.new_patients_today ?? "–"} tone="neutral" />
      </section>

      <section className="rcp-toolbar">
        <div className="rcp-toolbar-left">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rcp-date"
          />

          <div className="rcp-status-pills">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`rcp-pill ${statusFilter === s ? "is-active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <input
            type="search"
            placeholder="Search patient name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rcp-search"
          />
        </div>

        <div className="rcp-toolbar-right">
          <button className="btn-secondary" onClick={() => setShowPatientModal(true)}>
            + Register patient
          </button>
          <button className="cdx-submit rcp-book-btn" onClick={() => setShowBookModal(true)}>
            + Book appointment
          </button>
        </div>
      </section>

      {error && <div className="cdx-error rcp-error">{error}</div>}

      <section className="rcp-panel">
        <AppointmentsTable
          appointments={appointments}
          loading={loading}
          onStatusChange={handleStatusChange}
        />
      </section>

      {showPatientModal && (
        <PatientModal
          onClose={() => setShowPatientModal(false)}
          onRegistered={handlePatientRegistered}
        />
      )}

      {showBookModal && (
        <BookAppointmentModal
          prefillPatient={justRegistered}
          onClose={() => {
            setShowBookModal(false);
            setJustRegistered(null);
          }}
          onBooked={handleAppointmentBooked}
        />
      )}
    </div>
  );
}