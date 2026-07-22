import { useState } from "react";
import { registerPatient } from "../../api/receptionist";

const EMPTY_FORM = {
  full_name: "",
  phone: "",
  email: "",
  dob: "",
  gender: "Other",
  address: "",
  notes: "",
};

export default function PatientModal({ onClose, onRegistered }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.full_name.trim() || !form.phone.trim()) {
      setError("Full name and phone are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await registerPatient(form);
      onRegistered({ id: res.id, ...form });
    } catch (err) {
      setError(err.data?.message || err.message || "Could not register patient.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Register new patient</h3>

        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <label className="cdx-field">
              <span className="cdx-field-label">Full name *</span>
              <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Phone *</span>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Email</span>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Date of birth</span>
              <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Gender</span>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>

            <label className="cdx-field">
              <span className="cdx-field-label">Address</span>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} />
            </label>
          </div>

          <label className="cdx-field">
            <span className="cdx-field-label">Notes</span>
            <input value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>

          {error && <div className="cdx-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cdx-submit" disabled={saving}>
              {saving ? "Saving…" : "Register patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
