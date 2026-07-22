import { useEffect, useRef, useState } from "react";
import { bookAppointment, searchPatients } from "../../api/receptionist";

const DEPARTMENTS = ["General Checkup", "Blood Work", "Radiology", "Cardiology", "Pathology"];

export default function BookAppointmentModal({ onClose, onBooked, prefillPatient }) {
  const [patientQuery, setPatientQuery] = useState(prefillPatient?.full_name || "");
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(prefillPatient || null);
  const [showResults, setShowResults] = useState(false);

  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [priority, setPriority] = useState("Normal");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (selectedPatient && patientQuery === selectedPatient.full_name) return;
    if (!patientQuery.trim()) {
      setPatientResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPatients(patientQuery);
        setPatientResults(results);
        setShowResults(true);
      } catch {
        setPatientResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [patientQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  function pickPatient(p) {
    setSelectedPatient(p);
    setPatientQuery(p.full_name);
    setShowResults(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!selectedPatient) {
      setError("Search for and select a patient first.");
      return;
    }

    setSaving(true);
    try {
      await bookAppointment({
        patient_id: selectedPatient.id,
        department,
        appointment_date: date,
        appointment_time: time,
        priority,
        notes,
      });
      onBooked();
    } catch (err) {
      setError(err.data?.message || err.message || "Could not book appointment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Book appointment</h3>

        <form onSubmit={handleSubmit}>
          <label className="cdx-field" style={{ position: "relative" }}>
            <span className="cdx-field-label">Patient *</span>
            <input
              placeholder="Search by name or phone…"
              value={patientQuery}
              onChange={(e) => {
                setPatientQuery(e.target.value);
                setSelectedPatient(null);
              }}
              onFocus={() => patientResults.length && setShowResults(true)}
            />
            {showResults && patientResults.length > 0 && (
              <ul className="patient-results">
                {patientResults.map((p) => (
                  <li key={p.id} onClick={() => pickPatient(p)}>
                    <strong>{p.full_name}</strong>
                    <span>{p.phone}</span>
                  </li>
                ))}
              </ul>
            )}
          </label>

          <div className="modal-grid">
            <label className="cdx-field">
              <span className="cdx-field-label">Department</span>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Time</span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>

          <label className="cdx-field">
            <span className="cdx-field-label">Notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          {error && <div className="cdx-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cdx-submit" disabled={saving}>
              {saving ? "Booking…" : "Book appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
